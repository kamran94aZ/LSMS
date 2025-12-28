"use strict";

/**
 * ABAP Enterprise Kernel – Interpreter
 * -----------------------------------
 * This file is the central execution engine.
 * It does NOT implement logic itself,
 * it orchestrates all runtime engines.
 */

const Executor = require("../runtime/executor");
const RuntimeContext = require("../runtime/runtimeContext");
const Transaction = require("../runtime/transaction");
const DebugManager = require("../debugger/debugManager");
const ErrorHandler = require("../runtime/errorHandler");

class ABAPInterpreter {

    constructor(options = {}) {
        this.options = options;

        this.debugEnabled = !!options.debug;
        this.transactional = options.transactional !== false;

        this.executor = new Executor();
    }

    /**
     * Entry point for ABAP program execution
     * @param {Object} ast - Parsed AST from parser
     * @param {Object} input - Selection-screen / parameters
     */
    async run(ast, input = {}) {
        const rt = new RuntimeContext();

        // --- Initialize runtime ---
        rt.init(input);
        rt.debug = this.debugEnabled;

        let tx = null;

        if (this.transactional) {
            tx = new Transaction(rt);
        }

        try {
            // --- Pre-execution hook ---
            await this.beforeRun(rt);

            // --- Execute AST ---
            await this.executor.execute(ast, rt);

            // --- Commit transaction ---
            if (tx) tx.commit();

            // --- Post-execution hook ---
            await this.afterRun(rt);

            return {
                success: true,
                output: rt.output,
                variables: rt.variables,
                tables: rt.tables
            };

        } catch (err) {

            // --- Rollback on error ---
            if (tx) tx.rollback();

            // --- Debugger integration ---
            if (this.debugEnabled) {
                DebugManager.emit("runtimeError", {
                    error: err,
                    stack: rt.callStack
                });
            }

            ErrorHandler.handle(err, rt);

            return {
                success: false,
                error: err.message,
                stack: rt.callStack
            };
        }
    }

    /**
     * Hook before program execution
     */
    async beforeRun(rt) {
        if (this.debugEnabled) {
            DebugManager.startSession(rt);
        }
    }

    /**
     * Hook after program execution
     */
    async afterRun(rt) {
        if (this.debugEnabled) {
            DebugManager.endSession(rt);
        }
    }
}

module.exports = ABAPInterpreter;
