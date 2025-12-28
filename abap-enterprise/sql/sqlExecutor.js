"use strict";

/**
 * SQL Executor
 * ------------
 * Executes optimized SQL plans using dialect + adapter
 *
 * SAP equivalent:
 * - Native SQL Executor
 */

class SqlExecutor {

    constructor(dialect, adapter) {
        this.dialect = dialect;
        this.adapter = adapter;
    }

    /* =====================================================
     * EXECUTE PLAN
     * ===================================================== */

    async execute(plan) {
        const { sql, params } = this._buildSql(plan);

        // Execute via adapter
        const rows = await this.adapter.query(sql, params);
        return rows;
    }

    /* =====================================================
     * PLAN → SQL
     * ===================================================== */

    _buildSql(plan) {
        switch (plan.type) {

            case "SCAN":
                return this.dialect.buildSelect({
                    table: plan.table
                });

            case "FILTER": {
                const base = this._buildSql(plan.source);
                const where = this.dialect.buildWhere(plan.condition);

                return {
                    sql: `${base.sql} WHERE ${where.sql}`,
                    params: base.params.concat(where.params)
                };
            }

            case "JOIN": {
                const left = this._buildSql(plan.left);
                const join = this.dialect.buildJoin(plan.join);

                return {
                    sql: `${left.sql} ${join.sql}`,
                    params: left.params.concat(join.params)
                };
            }

            default:
                throw new Error(`Unknown plan type: ${plan.type}`);
        }
    }
}

module.exports = SqlExecutor;
