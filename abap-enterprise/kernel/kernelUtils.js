"use strict";

/**
 * ABAP Enterprise Kernel – Utilities
 * ---------------------------------
 * Common helper functions used across kernel
 *
 * SAP equivalent:
 * - Kernel utility layer
 * - Runtime helper services
 */

class KernelUtils {

    /* =====================================================
     * TRUTHINESS (ABAP BOOL SEMANTICS)
     * ===================================================== */

    static isTrue(value) {
        if (value === null || value === undefined) return false;

        if (typeof value === "boolean") return value;

        if (typeof value === "number") return value !== 0;

        if (typeof value === "string") return value.trim() !== "";

        if (Array.isArray(value)) return value.length > 0;

        if (typeof value === "object") return Object.keys(value).length > 0;

        return false;
    }

    /* =====================================================
     * INITIAL CHECK (IS INITIAL)
     * ===================================================== */

    static isInitial(value) {
        if (value === null || value === undefined) return true;

        if (typeof value === "number") return value === 0;

        if (typeof value === "string") return value.trim() === "";

        if (Array.isArray(value)) return value.length === 0;

        if (typeof value === "object") {
            return Object.values(value).every(v => this.isInitial(v));
        }

        return false;
    }

    /* =====================================================
     * COMPARISON (ABAP STYLE)
     * ===================================================== */

    static compare(a, b) {
        // ABAP implicit conversion behavior
        if (typeof a === "number" || typeof b === "number") {
            return Number(a) - Number(b);
        }

        const sa = String(a);
        const sb = String(b);

        if (sa === sb) return 0;
        return sa > sb ? 1 : -1;
    }

    /* =====================================================
     * DEEP CLONE (TRANSACTION SAFE)
     * ===================================================== */

    static deepClone(obj) {
        if (obj === null || typeof obj !== "object") {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(v => this.deepClone(v));
        }

        const cloned = Object.create(null);
        for (const k in obj) {
            cloned[k] = this.deepClone(obj[k]);
        }
        return cloned;
    }

    /* =====================================================
     * SAFE ASSIGN
     * ===================================================== */

    static safeAssign(target, source) {
        if (!target || !source) return;

        for (const k in source) {
            target[k] = this.deepClone(source[k]);
        }
    }

    /* =====================================================
     * ASSERTIONS (KERNEL SAFETY)
     * ===================================================== */

    static assert(condition, message) {
        if (!condition) {
            throw new Error(message || "Kernel assertion failed");
        }
    }

    /* =====================================================
     * RUNTIME TYPE INFO
     * ===================================================== */

    static typeOf(value) {
        if (Array.isArray(value)) return "TABLE";
        if (value === null) return "INITIAL";
        return typeof value;
    }
}

module.exports = KernelUtils;
