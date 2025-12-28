"use strict";

/**
 * ABAP Enterprise Kernel – Environment (SY-FIELDS)
 * -----------------------------------------------
 * Simulates SAP system fields (sy-*)
 *
 * SAP equivalent:
 * - SY structure
 * - Runtime environment variables
 */

class ABAPEnvironment {

    constructor() {
        this.reset();
    }

    /**
     * Reset environment to initial state
     * Called at program start
     */
    reset() {
        const now = new Date();

        this.sy = {
            subrc: 0,              // Return code
            tabix: 0,              // Internal table index
            index: 0,              // LOOP index
            dbcnt: 0,              // DB affected rows
            datum: this._date(now),
            uzeit: this._time(now),
            uname: "DEVELOPER",    // default user
            repid: "",             // program name
            langu: "E"             // language key
        };
    }

    /* =====================================================
     * SY-SUBRC
     * ===================================================== */

    setSubrc(value) {
        this.sy.subrc = value;
    }

    getSubrc() {
        return this.sy.subrc;
    }

    /* =====================================================
     * SY-TABIX / SY-INDEX
     * ===================================================== */

    setTabix(value) {
        this.sy.tabix = value;
    }

    setIndex(value) {
        this.sy.index = value;
    }

    resetIndex() {
        this.sy.index = 0;
        this.sy.tabix = 0;
    }

    /* =====================================================
     * DATABASE COUNTER
     * ===================================================== */

    setDbcnt(value) {
        this.sy.dbcnt = value;
    }

    incrementDbcnt() {
        this.sy.dbcnt++;
    }

    /* =====================================================
     * PROGRAM CONTEXT
     * ===================================================== */

    setProgram(name) {
        this.sy.repid = name;
    }

    setUser(username) {
        this.sy.uname = username;
    }

    setLanguage(lang) {
        this.sy.langu = lang;
    }

    /* =====================================================
     * TIME HANDLING
     * ===================================================== */

    refreshTime() {
        const now = new Date();
        this.sy.datum = this._date(now);
        this.sy.uzeit = this._time(now);
    }

    _date(d) {
        return (
            d.getFullYear().toString().padStart(4, "0") +
            (d.getMonth() + 1).toString().padStart(2, "0") +
            d.getDate().toString().padStart(2, "0")
        );
    }

    _time(d) {
        return (
            d.getHours().toString().padStart(2, "0") +
            d.getMinutes().toString().padStart(2, "0") +
            d.getSeconds().toString().padStart(2, "0")
        );
    }

    /* =====================================================
     * DEBUG / INSPECTION
     * ===================================================== */

    dump() {
        return { ...this.sy };
    }
}

module.exports = ABAPEnvironment;
