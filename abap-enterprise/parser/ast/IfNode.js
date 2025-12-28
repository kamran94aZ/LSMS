"use strict";

/**
 * ABAP AST – IfNode
 * ----------------
 * Represents IF / ELSEIF / ELSE control flow
 *
 * ABAP:
 *   IF <cond>.
 *     ...
 *   ELSEIF <cond>.
 *     ...
 *   ELSE.
 *     ...
 *   ENDIF.
 */

class IfNode {

    constructor({ condition, then, elseIfs = [], elseBlock = null }, meta = {}) {
        this.type = "IF";

        this.condition = condition;   // main IF condition
        this.then = then || [];       // statements inside IF

        this.elseIfs = elseIfs;       // [{ condition, then }]
        this.else = elseBlock;        // array of statements or null

        // Source mapping (IDE / Debugger)
        this.meta = {
            line: meta.line ?? null,
            column: meta.column ?? null
        };
    }

    /**
     * Optional execution helper
     * ControlFlow engine normally handles execution
     */
    async execute(ctx, executor, exprEngine) {

        // IF
        if (exprEngine.evaluate(this.condition, ctx)) {
            return executor.executeBlock(this.then, ctx);
        }

        // ELSEIF
        for (const elif of this.elseIfs) {
            if (exprEngine.evaluate(elif.condition, ctx)) {
                return executor.executeBlock(elif.then, ctx);
            }
        }

        // ELSE
        if (this.else) {
            return executor.executeBlock(this.else, ctx);
        }
    }

    /**
     * Debug representation
     */
    toString() {
        return `IF (...) THEN ${this.then.length} stmt(s)` +
               (this.elseIfs.length ? ` ELSEIF ${this.elseIfs.length}` : "") +
               (this.else ? " ELSE ..." : "");
    }
}

module.exports = IfNode;
