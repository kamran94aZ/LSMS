"use strict";

/**
 * ABAP AST – SelectNode
 * --------------------
 * Represents an ABAP OPEN SQL SELECT statement
 *
 * ABAP:
 *   SELECT ... FROM ... INTO ... WHERE ...
 */

class SelectNode {

    constructor(options = {}, meta = {}) {
        this.type = "SELECT";

        // SELECT fields
        this.fields = options.fields || ["*"];

        // FROM table
        this.table = options.table;

        // INTO target
        this.into = options.into || null;
        this.intoTable = !!options.intoTable;

        // WHERE expression (AST)
        this.where = options.where || null;

        // Future extensions
        this.joins = options.joins || [];
        this.orderBy = options.orderBy || null;
        this.groupBy = options.groupBy || null;

        // Source mapping (IDE / Debugger)
        this.meta = {
            line: meta.line ?? null,
            column: meta.column ?? null
        };
    }

    /**
     * Optional execution helper
     * Normally executed via Executor -> sqlEngine
     */
    async execute(ctx) {
        const rows = await ctx.sqlEngine.select(
            this.table,
            this.fields,
            this.where
        );

        if (!this.into) return;

        if (this.intoTable) {
            const itab = ctx.resolve(this.into);
            for (const row of rows) {
                itab.rows.push(row);
            }
        } else {
            if (rows.length > 0) {
                ctx.assign(this.into, rows[0]);
            }
        }
    }

    /**
     * Debug-friendly representation
     */
    toString() {
        const f = this.fields.join(", ");
        return `SELECT ${f} FROM ${this.table}`;
    }
}

module.exports = SelectNode;
