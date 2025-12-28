"use strict";

/**
 * ABAP Enterprise Kernel – Control Flow Engine
 * -------------------------------------------
 * Handles ABAP flow control statements
 *
 * SAP equivalent:
 * - IF / LOOP kernel
 * - Runtime flow dispatcher
 */

class ControlFlow {

    constructor(expressionEngine, env) {
        this.expr = expressionEngine;
        this.env = env;
    }

    /* =====================================================
     * IF / ELSEIF / ELSE
     * ===================================================== */

    async executeIf(node, ctx, executor) {
        // IF condition
        if (this.expr.evaluate(node.condition, ctx)) {
            await executor.executeBlock(node.then, ctx);
            return;
        }

        // ELSEIF blocks
        if (node.elseIfs) {
            for (const elif of node.elseIfs) {
                if (this.expr.evaluate(elif.condition, ctx)) {
                    await executor.executeBlock(elif.then, ctx);
                    return;
                }
            }
        }

        // ELSE block
        if (node.else) {
            await executor.executeBlock(node.else, ctx);
        }
    }

    /* =====================================================
     * LOOP AT internal table
     * ===================================================== */

    async executeLoop(node, ctx, executor) {
        const table = ctx.resolve(node.table);

        if (!table || !table.rows) {
            throw new Error("LOOP AT on non-table");
        }

        for (let i = 0; i < table.rows.length; i++) {
            this.env.setIndex(i + 1);
            this.env.setTabix(i + 1);

            ctx.assign(node.into, table.rows[i]);

            try {
                await executor.executeBlock(node.body, ctx);
            } catch (flow) {
                if (flow === "CONTINUE") continue;
                if (flow === "EXIT") break;
                throw flow;
            }
        }

        this.env.resetIndex();
    }

    /* =====================================================
     * DO ... TIMES
     * ===================================================== */

    async executeDo(node, ctx, executor) {
        const times = node.times
            ? this.expr.evaluate(node.times, ctx)
            : Infinity;

        for (let i = 1; i <= times; i++) {
            this.env.setIndex(i);

            try {
                await executor.executeBlock(node.body, ctx);
            } catch (flow) {
                if (flow === "CONTINUE") continue;
                if (flow === "EXIT") break;
                throw flow;
            }
        }

        this.env.resetIndex();
    }

    /* =====================================================
     * WHILE
     * ===================================================== */

    async executeWhile(node, ctx, executor) {
        let i = 0;

        while (this.expr.evaluate(node.condition, ctx)) {
            i++;
            this.env.setIndex(i);

            try {
                await executor.executeBlock(node.body, ctx);
            } catch (flow) {
                if (flow === "CONTINUE") continue;
                if (flow === "EXIT") break;
                throw flow;
            }
        }

        this.env.resetIndex();
    }

    /* =====================================================
     * CHECK
     * ===================================================== */

    executeCheck(node, ctx) {
        const ok = this.expr.evaluate(node.condition, ctx);
        if (!ok) {
            throw "CONTINUE"; // ABAP semantics
        }
    }

    /* =====================================================
     * EXIT / CONTINUE
     * ===================================================== */

    executeExit() {
        throw "EXIT";
    }

    executeContinue() {
        throw "CONTINUE";
    }
}

module.exports = ControlFlow;
