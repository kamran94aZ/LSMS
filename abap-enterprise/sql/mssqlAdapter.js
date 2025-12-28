"use strict";

/**
 * MSSQL Adapter
 * -------------
 * Handles MSSQL connection and query execution
 */

const sql = require("mssql");

class MSSQLAdapter {

    constructor(config) {
        this.config = config;
        this.pool = null;
    }

    async connect() {
        if (!this.pool) {
            this.pool = await sql.connect(this.config);
        }
    }

    async query(query, params = []) {
        await this.connect();

        const request = this.pool.request();

        params.forEach((p, i) => {
            request.input(`p${i}`, p);
        });

        const result = await request.query(
            this._bindParams(query, params.length)
        );

        return result.recordset || [];
    }

    /* =====================================================
     * TRANSACTION SUPPORT
     * ===================================================== */

    async begin() {
        await this.connect();
        this.transaction = new sql.Transaction(this.pool);
        await this.transaction.begin();
    }

    async commit() {
        if (this.transaction) {
            await this.transaction.commit();
            this.transaction = null;
        }
    }

    async rollback() {
        if (this.transaction) {
            await this.transaction.rollback();
            this.transaction = null;
        }
    }

    /* =====================================================
     * PARAM BINDING
     * ===================================================== */

    _bindParams(sqlText, count) {
        let out = sqlText;
        for (let i = 0; i < count; i++) {
            out = out.replace("?", `@p${i}`);
        }
        return out;
    }
}

module.exports = MSSQLAdapter;
