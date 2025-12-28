"use strict";

/**
 * ABAP Runtime – System Fields (sy-*)
 * ----------------------------------
 * Central system field manager
 *
 * SAP equivalent:
 * - sy-subrc
 * - sy-tabix
 * - sy-index
 * - sy-dbcnt
 */

class SystemFields {

    constructor() {
        this.reset();
    }

    /* =====================================================
     * RESET
     * ===================================================== */

    reset() {
        this.subrc = 0;
        this.tabix = 0;
        this.index = 0;
        this.dbcnt = 0;
    }

    /* =====================================================
     * SETTERS
     * ===================================================== */

    setSubrc(val) {
        this.subrc = Number(val);
    }

    setTabix(val) {
        this.tabix = Number(val);
    }

    setIndex(val) {
        this.index = Number(val);
    }

    setDbcnt(val) {
        this.dbcnt = Number(val);
    }

    /* =====================================================
     * GETTERS
     * ===================================================== */

    get sy() {
        return {
            subrc: this.subrc,
            tabix: this.tabix,
            index: this.index,
            dbcnt: this.dbcnt
        };
    }

    /* =====================================================
     * DEBUG
     * ===================================================== */

    dump() {
        return this.sy;
    }
}

module.exports = SystemFields;
