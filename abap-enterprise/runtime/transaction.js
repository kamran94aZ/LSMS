"use strict";

/**
 * ABAP Runtime – Transaction Manager
 * ---------------------------------
 * Handles logical units of work (LUW)
 *
 * SAP equivalent:
 * - ABAP Transaction Manager
 * - COMMIT WORK / ROLLBACK WORK
 */

const KernelUtils = require("../kernel/kernelUtils");

class Transaction {

    constructor(runtime) {
        this.runtime = runtime;

        // Snapshot of runtime memory
        this.snapshot = null;

        // Transaction state
        this.active = false;

        // Begin transaction immediately
        this.begin();
    }

    /* =====================================================
     * BEGIN TRANSACTION
     * ===================================================== */

    begin() {
        if (this.active) return;

        this.snapshot = {
            variables: KernelUtils.deepClone(this.runtime.variables),
            tables: KernelUtils.deepClone(this.runtime.tables),
            sys: KernelUtils.deepClone(this.runtime.sys.dump())
        };

        // Begin DB transaction if adapter supports it
        if (this.runtime.sqlEngine?.adapter?.begin) {
            this.runtime.sqlEngine.adapter.begin();
        }

        this.active = true;
    }

    /* =====================================================
     * COMMIT WORK
     * ===================================================== */

    commit() {
        if (!this.active) return;

        // Commit DB transaction
        if (this.runtime.sqlEngine?.adapter?.commit) {
            this.runtime.sqlEngine.adapter.commit();
        }

        // Drop snapshot
        this.snapshot = null;
        this.active = false;
    }

    /* =====================================================
     * ROLLBACK WORK
     * ===================================================== */

    rollback() {
        if (!this.active) return;

        // Rollback DB transaction
        if (this.runtime.sqlEngine?.adapter?.rollback) {
            this.runtime.sqlEngine.adapter.rollback();
        }

        // Restore runtime memory
        this.runtime.variables = KernelUtils.deepClone(this.snapshot.variables);
        this.runtime.tables = KernelUtils.deepClone(this.snapshot.tables);

        // Restore system fields
        this.runtime.sys.reset();
        Object.assign(this.runtime.sys, this.snapshot.sys);

        this.snapshot = null;
        this.active = false;
    }
}

module.exports = Transaction;
