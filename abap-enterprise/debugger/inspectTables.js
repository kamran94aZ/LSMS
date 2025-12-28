"use strict";

/**
 * Internal Table Inspector
 * ------------------------
 * Displays internal tables
 */

module.exports = function inspectTables(runtime) {
    const out = {};
    for (const [name, table] of Object.entries(runtime.tables)) {
        out[name] = {
            rows: table.length,
            preview: table.slice(0, 10)
        };
    }
    return out;
};
