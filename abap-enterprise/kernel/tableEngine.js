"use strict";

/**
 * ABAP Enterprise Kernel – Internal Table Engine
 * ---------------------------------------------
 * Simulates ABAP internal tables:
 * STANDARD / SORTED / HASHED (basic support)
 *
 * SAP equivalent:
 * - Internal Table Kernel
 */

class TableEngine {

    constructor(env) {
        // ABAP environment (sy-*)
        this.env = env;
    }

    /* =====================================================
     * CREATE
     * ===================================================== */

    create(lineType) {
        return {
            __abapTable: true,
            type: "STANDARD",
            lineType,
            rows: []
        };
    }

    /* =====================================================
     * APPEND
     * ===================================================== */

    append(table, row) {
        this._assertTable(table);
        table.rows.push(row);
        this.env.setSubrc(0);
        this.env.setTabix(table.rows.length);
    }

    /* =====================================================
     * INSERT (INDEX)
     * ===================================================== */

    insert(table, row, index = null) {
        this._assertTable(table);

        if (index === null || index > table.rows.length) {
            table.rows.push(row);
            this.env.setTabix(table.rows.length);
        } else {
            table.rows.splice(index - 1, 0, row);
            this.env.setTabix(index);
        }

        this.env.setSubrc(0);
    }

    /* =====================================================
     * READ TABLE
     * ===================================================== */

    read(table, predicate) {
        this._assertTable(table);

        for (let i = 0; i < table.rows.length; i++) {
            if (predicate(table.rows[i])) {
                this.env.setSubrc(0);
                this.env.setTabix(i + 1);
                return table.rows[i];
            }
        }

        this.env.setSubrc(4);
        this.env.setTabix(0);
        return null;
    }

    /* =====================================================
     * LOOP AT
     * ===================================================== */

    async loop(table, callback) {
        this._assertTable(table);

        for (let i = 0; i < table.rows.length; i++) {
            this.env.setIndex(i + 1);
            this.env.setTabix(i + 1);
            await callback(table.rows[i], i + 1);
        }

        this.env.resetIndex();
        this.env.setSubrc(0);
    }

    /* =====================================================
     * DELETE
     * ===================================================== */

    delete(table, predicate = null) {
        this._assertTable(table);

        if (!predicate) {
            table.rows = [];
            this.env.setSubrc(0);
            return;
        }

        const before = table.rows.length;
        table.rows = table.rows.filter(r => !predicate(r));

        this.env.setSubrc(
            before === table.rows.length ? 4 : 0
        );
    }

    /* =====================================================
     * MODIFY
     * ===================================================== */

    modify(table, predicate, newRow) {
        this._assertTable(table);

        for (let i = 0; i < table.rows.length; i++) {
            if (predicate(table.rows[i])) {
                table.rows[i] = newRow;
                this.env.setSubrc(0);
                this.env.setTabix(i + 1);
                return;
            }
        }

        this.env.setSubrc(4);
    }

    /* =====================================================
     * SORT
     * ===================================================== */

    sort(table, keys) {
        this._assertTable(table);

        table.rows.sort((a, b) => {
            for (const key of keys) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
            }
            return 0;
        });

        this.env.setSubrc(0);
    }

    /* =====================================================
     * DESCRIBE TABLE
     * ===================================================== */

    describe(table) {
        this._assertTable(table);
        return {
            lines: table.rows.length
        };
    }

    /* =====================================================
     * COLLECT
     * ===================================================== */

    collect(table, row, keyFields) {
        this._assertTable(table);

        for (let r of table.rows) {
            let match = keyFields.every(
                k => r[k] === row[k]
            );

            if (match) {
                for (let f in row) {
                    if (typeof row[f] === "number") {
                        r[f] += row[f];
                    }
                }
                this.env.setSubrc(0);
                return;
            }
        }

        table.rows.push(row);
        this.env.setSubrc(0);
    }

    /* =====================================================
     * HELPERS
     * ===================================================== */

    _assertTable(table) {
        if (!table || table.__abapTable !== true) {
            throw new Error("Not an ABAP internal table");
        }
    }
}

module.exports = TableEngine;
