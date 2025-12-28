"use strict";

/**
 * ABAP Runtime – Method Dispatcher
 * --------------------------------
 * Handles CALL METHOD and -> method calls
 *
 * SAP equivalent:
 * - ABAP Method Call Dispatcher
 */

const {
    CX_SY_REF_IS_INITIAL
} = require("./errorHandler");

class MethodDispatcher {

    constructor(runtime, objectManager) {
        this.runtime = runtime;
        this.objectManager = objectManager;
    }

    /* =====================================================
     * CALL METHOD
     * ===================================================== */

    async call(ref, methodName) {

        // --- Reference check ---
        this.objectManager.ensureNotInitial(ref);

        const instance = this.objectManager.getObject(ref);
        const className = instance.__class;

        const cls = this.runtime.classRegistry.classes[className];
        if (!cls) {
            throw new Error(`Class not found: ${className}`);
        }

        const method = cls.methods[methodName];
        if (!method) {
            throw new Error(`Method not implemented: ${methodName}`);
        }

        // --- Push call stack ---
        this.runtime.pushStack({
            type: "METHOD",
            class: className,
            method: methodName
        });

        try {
            // --- Execute method body ---
            await this.runtime.executor.executeBlock(
                method.body,
                this.runtime
            );

            // ABAP: sy-subrc = 0 on success
            this.runtime.sys.setSubrc(0);

        } finally {
            // --- Pop call stack ---
            this.runtime.popStack();
        }
    }
}

module.exports = MethodDispatcher;
