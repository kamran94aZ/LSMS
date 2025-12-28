"use strict";

/**
 * ABAP AST – LoopNode
 * ------------------
 * Represents LOOP / DO / WHILE statements
 *
 * ABAP:
 *   LOOP AT itab INTO wa.
 *   DO <n> TIMES.
 *   WHILE <cond>.
 */

class LoopNode {

    constructor(kind, options = {}, meta = {}) {
        this.type = "LOOP";

        // kind: "LOOP_AT" | "DO" | "WHILE"
        this.kind = kind;

        // LOOP AT
        this.table = options.table || null;
        this.into = options.into || null;

        // DO / WHILE
        this.times = options.times || null;
        this.condition = options.condition || null;

        // Body statements
        this.body = options.body || [];

        // Source mapping (IDE / Debugger)
        this.meta = {
            line: meta.line ?? null,
            column: meta.column ?? null
        };
    }

    /**
     * Optional execution helper
     * Normally handled by ControlFlow engine
     */
    async execute(ctx, executor, exprEngine, controlFlow) {
        switch (this.kind) {

            case "LOOP_AT":
                return controlFlow.executeLoop(
                    {
                        table: this.table,
                        into: this.into,
                        body: this.body
                    },
                    ctx,
                    executor
                );

            case "DO":
                return controlFlow.executeDo(
                    {
                        times: this.times,
                        body: this.body
                    },
                    ctx,
                    executor
                );

            case "WHILE":
                return controlFlow.executeWhile(
                    {
                        condition: this.condition,
                        body: this.body
                    },
                    ctx,
                    executor
                );

            default:
                throw new Error(`Unknown loop kind: ${this.kind}`);
        }
    }

    /**
     * Debug-friendly representation
     */
    toString() {
        switch (this.kind) {
            case "LOOP_AT":
                return `LOOP AT ${this.table} INTO ${this.into}`;
            case "DO":
                return `DO ${this.times ? "N" : "∞"} TIMES`;
            case "WHILE":
                return `WHILE (...)`;
            default:
                return "LOOP";
        }
    }
}

module.exports = LoopNode;
