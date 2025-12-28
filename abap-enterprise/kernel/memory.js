"use strict";

/**
 * ABAP Enterprise Kernel – Memory Manager
 * --------------------------------------
 * This module simulates ABAP memory areas:
 *
 * - Local memory (DATA, FIELD-SYMBOLS)
 * - Roll area (call stack variables)
 * - Shared memory (EXPORT/IMPORT, SHARED OBJECTS)
 *
 * Design goal:
 * - Deterministic
 * - Transaction-aware
 * - Debug-friendly
 * - SAP-like behavior
 */

class MemoryManager {

    constructor() {
        // --- Local program memory ---
        this.local = Object.create(null);

        // --- Call stack memory (per FORM / METHOD) ---
        this.stack = [];

        // --- Shared memory (cross-program) ---
        this.shared = Object.create(null);

        // --- Snapshots for rollback (transaction support) ---
        this.snapshots = [];
    }

    /* =====================================================
     * LOCAL MEMORY (DATA, PARAMETERS, SELECT-OPTIONS)
     * ===================================================== */

    set(name, value) {
        this.local[name] = value;
    }

    get(name) {
        return this.local[name];
    }

    has(name) {
        return Object.prototype.hasOwnProperty.call(this.local, name);
    }

    delete(name) {
        delete this.local[name];
    }

    /* =====================================================
     * STACK MEMORY (FORMS / METHODS / FUNCTION MODULES)
     * ===================================================== */

    pushFrame(frameName) {
        this.stack.push({
            name: frameName,
            vars: Object.create(null)
        });
    }

    popFrame() {
        return this.stack.pop();
    }

    setStackVar(name, value) {
        if (this.stack.length === 0) {
            throw new Error("No active stack frame");
        }
        this.stack[this.stack.length - 1].vars[name] = value;
    }

    getStackVar(name) {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            if (name in this.stack[i].vars) {
                return this.stack[i].vars[name];
            }
        }
        return undefined;
    }

    /* =====================================================
     * SHARED MEMORY (EXPORT / IMPORT, SHARED OBJECTS)
     * ===================================================== */

    export(key, value) {
        this.shared[key] = JSON.stringify(value);
    }

    import(key) {
        if (!(key in this.shared)) return undefined;
        return JSON.parse(this.shared[key]);
    }

    freeShared(key) {
        delete this.shared[key];
    }

    /* =====================================================
     * TRANSACTION SUPPORT (COMMIT / ROLLBACK)
     * ===================================================== */

    snapshot() {
        this.snapshots.push({
            local: structuredClone(this.local),
            stack: structuredClone(this.stack),
            shared: structuredClone(this.shared)
        });
    }

    rollback() {
        const snap = this.snapshots.pop();
        if (!snap) return;

        this.local = snap.local;
        this.stack = snap.stack;
        this.shared = snap.shared;
    }

    commit() {
        // On commit we simply clear snapshots
        this.snapshots = [];
    }

    /* =====================================================
     * DEBUG SUPPORT
     * ===================================================== */

    dump() {
        return {
            local: this.local,
            stack: this.stack,
            shared: this.shared
        };
    }
}

module.exports = MemoryManager;
