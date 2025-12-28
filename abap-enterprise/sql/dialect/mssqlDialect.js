"use strict";

/**
 * MSSQL Dialect
 * -------------
 * Generates MSSQL-compatible SQL fragments
 */

class MSSQLDialect {

    buildSelect({ table }) {
        return {
            sql: `SELECT * FROM ${table}`,
            params: []
        };
    }

    buildWhere(expr) {
        switch (expr.type) {

            case "BINARY":
                const left = this.buildWhere(expr.left);
                const right = this.buildWhere(expr.right);
                return {
                    sql: `${left.sql} ${expr.operator} ${right.sql}`,
                    params: left.params.concat(right.params)
                };

            case "VARIABLE":
                return {
                    sql: expr.name,
                    params: []
                };

            case "LITERAL":
                return {
                    sql: "?",
                    params: [expr.value]
                };

            default:
                throw new Error(`Unsupported WHERE expression: ${expr.type}`);
        }
    }

    buildJoin(join) {
        const type = join.type || "INNER";
        return {
            sql: `${type} JOIN ${join.table} ON ${join.on}`,
            params: []
        };
    }
}

module.exports = MSSQLDialect;
