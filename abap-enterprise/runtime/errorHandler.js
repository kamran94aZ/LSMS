"use strict";

/**
 * ABAP Runtime – Error & Exception Handler
 * ---------------------------------------
 * Simulates ABAP CX_* exception hierarchy
 *
 * SAP equivalent:
 * - CX_ROOT and system exceptions
 */

class CX_ROOT extends Error {
    constructor(message = "ABAP Runtime Exception") {
        super(message);
        this.name = this.constructor.name;
    }
}

/* =====================================================
 * SYSTEM EXCEPTIONS (CX_SY_*)
 * ===================================================== */

class CX_SY_ITAB_LINE_NOT_FOUND extends CX_ROOT {
    constructor() {
        super("Internal table line not found");
    }
}

class CX_SY_ZERODIVIDE extends CX_ROOT {
    constructor() {
        super("Division by zero");
    }
}

class CX_SY_MOVE_CAST_ERROR extends CX_ROOT {
    constructor() {
        super("Move cast error");
    }
}

class CX_SY_REF_IS_INITIAL extends CX_ROOT {
    constructor() {
        super("Reference is initial");
    }
}

/* =====================================================
 * ERROR HANDLER API
 * ===================================================== */

class ErrorHandler {

    /* ---------------------------------
     * THROW ABAP EXCEPTION
     * --------------------------------- */
    static raise(exception) {
        throw exception;
    }

    /* ---------------------------------
     * HANDLE RUNTIME ERROR
     * --------------------------------- */
    static handle(error, runtime) {

        // ABAP exception → rethrow
        if (error instanceof CX_ROOT) {
            throw error;
        }

        // JS error → wrap into CX_ROOT
        const cx = new CX_ROOT(error.message || "Runtime error");

        // Optional: attach call stack
        cx.callStack = runtime?.callStack || [];

        throw cx;
    }

    /* ---------------------------------
     * TRY / CATCH SIMULATION
     * --------------------------------- */
    static async tryCatch(tryFn, catchMap = {}) {
        try {
            return await tryFn();
        } catch (e) {
            for (const cxName in catchMap) {
                if (e.name === cxName || e instanceof catchMap[cxName]) {
                    return catchMap[cxName](e);
                }
            }
            throw e;
        }
    }
}

/* =====================================================
 * EXPORTS
 * ===================================================== */

module.exports = {
    ErrorHandler,
    CX_ROOT,
    CX_SY_ITAB_LINE_NOT_FOUND,
    CX_SY_ZERODIVIDE,
    CX_SY_MOVE_CAST_ERROR,
    CX_SY_REF_IS_INITIAL
};
