"use strict";

/**
 * DDIC View Resolver
 * ------------------
 * Expands DDIC views into executable SQL structures
 *
 * SAP equivalent:
 * - View Resolver
 * - DDIC View Expander
 */

class ViewResolver {

    constructor(ddic) {
        this.ddic = ddic;
    }

    /* =====================================================
     * RESOLVE TABLE OR VIEW
     * ===================================================== */

    resolve(name) {
        const table = this.ddic.getTable(name);
        if (table) {
            return {
                type: "TABLE",
                table: name
            };
        }

        const view = this.ddic.getView(name);
        if (view) {
            return this._expandView(view);
        }

        throw new Error(`DDIC: Table or View not found: ${name}`);
    }

    /* =====================================================
     * EXPAND VIEW
     * ===================================================== */

    _expandView(view) {
        return {
            type: "VIEW",
            baseTable: view.baseTable,
            joins: view.joins || [],
            fields: view.fields || []
        };
    }
}

module.exports = ViewResolver;
