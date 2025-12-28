"use strict";

/**
 * ABAP Enterprise Runtime – SQL Engine
 * -----------------------------------
 * Executes ABAP Open SQL SELECT statements
 *
 * SAP equivalent:
 * - Open SQL runtime interface
 */

const KernelUtils = require("../kernel/kernelUtils");

class SQLEngine {

    constructor(runtime) {
        this.runtime = runtime;

        // Adapter injected later (MSSQL, SQLite, etc.)
        this.adapter = null;
    }

    /* =====================================================
     * ADAPTER SETUP
     * ===================================================== */

    setAdapter(adapter) {
        this.adapter = adapter;
    }

    /* =====================================================
     * SELECT
     * ===================================================== */

    async select(table, fields, whereExpr) {
        if (!this.adapter) {
            throw new Error("SQL adapter not configured");
        }

        /* ---------------------------------
         * BUILD SQL
         * --------------------------------- */

        const sqlFields =
            fields.includes("*") ? "*" : fields.join(", ");

        let sql = `SELECT ${sqlFields} FROM ${table}`;

        let params = [];
        if (whereExpr) {
            const where = this._buildWhere(whereExpr, params);
            sql += ` WHERE ${where}`;
        }

        /* ---------------------------------
         * EXECUTE
         * --------------------------------- */

        const result = await this.adapter.query(sql, params);

        // sy-dbcnt
        this.runtime.env.setDbcnt(result.length);
        this.runtime.env.setSubrc(result.length > 0 ? 0 : 4);

        return result.map(r => KernelUtils.deepClone(r));
    }

    /* =====================================================
     * WHERE BUILDER (Expression → SQL)
     * ===================================================== */

    _buildWhere(expr, params) {
        switch (expr.type) {

            case "BINARY":
                return `${this._buildWhere(expr.left, params)}
                        ${expr.operator}
                        ${this._buildWhere(expr.right, params)}`;

            case "VARIABLE":
                return expr.name;

            case "LITERAL":
                params.push(expr.value);
                return "?";

            case "BETWEEN":
                return `(${this._buildWhere(expr.expr, params)} BETWEEN
                        ${this._buildWhere(expr.low, params)} AND
                        ${this._buildWhere(expr.high, params)})`;

            case "IN":
                const placeholders = expr.list.map(e => {
                    params.push(e.value);
                    return "?";
                });
                return `${this._buildWhere(expr.expr, params)} IN (${placeholders.join(",")})`;

            default:
                throw new Error(`Unsupported WHERE expression: ${expr.type}`);
        }
    }
}

module.exports = SQLEngine;
