"use strict";

/**
 * ABAP Enterprise Runtime – Executor
 * ---------------------------------
 * Executes AST nodes produced by parser
 *
 * SAP equivalent:
 * - ABAP Runtime Interpreter
 * - Statement dispatcher
 */

const ControlFlow = require("../kernel/controlFlow");
const ExpressionEngine = require("../kernel/expression");
const TableEngine = require("../kernel/tableEngine");
const KernelUtils = require("../kernel/kernelUtils");

class Executor {

    constructor() {
        this.controlFlow = null;
        this.expr = null;
        this.tableEngine = null;
    }

    /* =====================================================
     * ENTRY
     * ===================================================== */

    async execute(ast, ctx) {
        this._initKernel(ctx);

        if (ast.type !== "PROGRAM") {
            throw new Error("Invalid AST root");
        }

        await this.executeBlock(ast.body, ctx);
    }

    async executeBlock(statements, ctx) {
        for (const stmt of statements) {
            await this.executeStatement(stmt, ctx);
        }
    }

    /* =====================================================
     * STATEMENT DISPATCHER
     * ===================================================== */

    async executeStatement(node, ctx) {

        switch (node.type) {

            /* ---------------- DATA / TYPES ---------------- */

            case "DATA":
                return this._execData(node, ctx);

            case "TYPES":
                return this._execTypes(node, ctx);

            /* ---------------- OUTPUT ---------------- */

            case "WRITE":
                return this._execWrite(node, ctx);

            /* ---------------- CONTROL FLOW ---------------- */

            case "IF":
                return this.controlFlow.executeIf(node, ctx, this);

            case "LOOP":
                return this.controlFlow.executeLoop(node, ctx, this);

            case "DO":
                return this.controlFlow.executeDo(node, ctx, this);

            case "WHILE":
                return this.controlFlow.executeWhile(node, ctx, this);

            case "CHECK":
                return this.controlFlow.executeCheck(node, ctx);

            case "EXIT":
                return this.controlFlow.executeExit();

            case "CONTINUE":
                return this.controlFlow.executeContinue();

            /* ---------------- SQL ---------------- */

            case "SELECT":
                return this._execSelect(node, ctx);

            /* ---------------- OOP ---------------- */

            case "CLASS_DEFINITION":
                return this._execClassDefinition(node, ctx);

            case "CLASS_IMPLEMENTATION":
                return this._execClassImplementation(node, ctx);

            case "METHOD_IMPL":
                // method body execution handled by OOP runtime
                return;

            default:
                throw new Error(`Unsupported AST node: ${node.type}`);
        }
    }

    /* =====================================================
     * DATA / TYPES
     * ===================================================== */

    _execData(node, ctx) {
        for (const decl of node.declarations) {
            ctx.declareVariable(
                decl.name,
                decl.dataType,
                decl.length
            );
        }
    }

    _execTypes(node, ctx) {
        ctx.registerType(node.name, node.fields);
    }

    /* =====================================================
     * WRITE
     * ===================================================== */

    _execWrite(node, ctx) {
        const value = this.expr.evaluate(node.expression, ctx);
        ctx.output.push(String(value));
    }

    /* =====================================================
     * SELECT (Open SQL)
     * ===================================================== */

    async _execSelect(node, ctx) {
        const rows = await ctx.sqlEngine.select(
            node.table,
            node.fields,
            node.where
        );

        if (!node.into) return;

        if (node.intoTable) {
            const itab = ctx.resolve(node.into);
            for (const row of rows) {
                this.tableEngine.append(itab, row);
            }
        } else {
            if (rows.length > 0) {
                ctx.assign(node.into, rows[0]);
            }
        }
    }

    /* =====================================================
     * CLASS DEFINITION
     * ===================================================== */

    _execClassDefinition(node, ctx) {
        ctx.classRegistry.define(
            node.name,
            node.sections
        );
    }

    /* =====================================================
     * CLASS IMPLEMENTATION
     * ===================================================== */

    _execClassImplementation(node, ctx) {
        ctx.classRegistry.implement(
            node.name,
            node.methods
        );
    }

    /* =====================================================
     * KERNEL INIT
     * ===================================================== */

    _initKernel(ctx) {
        if (this.controlFlow) return;

        this.expr = new ExpressionEngine(ctx.types);
        this.tableEngine = new TableEngine(ctx.env);
        this.controlFlow = new ControlFlow(this.expr, ctx.env);
    }
}

module.exports = Executor;
