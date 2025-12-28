"use strict";

/**
 * ABAP Runtime – Function Executor
 * --------------------------------
 * Executes ABAP Function Modules (CALL FUNCTION)
 *
 * SAP equivalent:
 * - Function Module Runtime
 * - Function Group Dispatcher
 */

class FunctionExecutor {

    constructor(runtime) {
        this.runtime = runtime;

        // Function registry
        // name -> { importing, exporting, tables, body }
        this.functions = Object.create(null);
    }

    /* =====================================================
     * FUNCTION REGISTRATION
     * ===================================================== */

    register(name, definition) {
        if (this.functions[name]) {
            throw new Error(`Function already defined: ${name}`);
        }

        this.functions[name] = {
            importing: definition.importing || [],
            exporting: definition.exporting || [],
            tables: definition.tables || [],
            body: definition.body || []
        };
    }

    /* =====================================================
     * CALL FUNCTION
     * ===================================================== */

    async call(name, params = {}) {

        const fn = this.functions[name];
        if (!fn) {
            throw new Error(`Function module not found: ${name}`);
        }

        // --- Prepare local context ---
        const local = Object.create(null);

        /* -----------------------------
         * IMPORTING
         * ----------------------------- */
        for (const p of fn.importing) {
            local[p] = params[p];
        }

        /* -----------------------------
         * TABLES
         * ----------------------------- */
        for (const t of fn.tables) {
            local[t] = params[t];
        }

        // --- Push call stack ---
        this.runtime.pushStack({
            type: "FUNCTION",
            name
        });

        try {
            // Execute function body
            await this.runtime.executor.executeBlock(
                fn.body,
                this.runtime
            );

            // EXPORTING
            for (const e of fn.exporting) {
                if (e in local) {
                    params[e] = local[e];
                }
            }

            // ABAP: success
            this.runtime.sys.setSubrc(0);

        } finally {
            // --- Pop call stack ---
            this.runtime.popStack();
        }
    }

    /* =====================================================
     * DEBUG
     * ===================================================== */

    dump() {
        return Object.keys(this.functions);
    }
}

module.exports = FunctionExecutor;
