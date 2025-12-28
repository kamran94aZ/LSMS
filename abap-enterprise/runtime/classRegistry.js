"use strict";

/**
 * ABAP Enterprise Runtime – Class Registry
 * ---------------------------------------
 * Runtime support for ABAP Objects
 *
 * SAP equivalent:
 * - ABAP Objects runtime kernel
 */

class ClassRegistry {

    constructor(runtime) {
        this.runtime = runtime;

        // className -> metadata
        this.classes = Object.create(null);
    }

    /* =====================================================
     * CLASS DEFINITION
     * ===================================================== */

    define(className, sections) {
        if (this.classes[className]) {
            throw new Error(`Class already defined: ${className}`);
        }

        this.classes[className] = {
            name: className,
            sections,
            methods: Object.create(null)
        };
    }

    /* =====================================================
     * CLASS IMPLEMENTATION
     * ===================================================== */

    implement(className, methods) {
        const cls = this.classes[className];
        if (!cls) {
            throw new Error(`Class not defined: ${className}`);
        }

        for (const m of methods) {
            cls.methods[m.name] = {
                body: m.body
            };
        }
    }

    /* =====================================================
     * CREATE OBJECT
     * ===================================================== */

    createInstance(className) {
        const cls = this.classes[className];
        if (!cls) {
            throw new Error(`Class not found: ${className}`);
        }

        const instance = {
            __class: className,
            __fields: Object.create(null)
        };

        return instance;
    }

    /* =====================================================
     * CALL METHOD
     * ===================================================== */

    async callMethod(instance, methodName) {
        const cls = this.classes[instance.__class];
        if (!cls) {
            throw new Error(`Invalid object instance`);
        }

        const method = cls.methods[methodName];
        if (!method) {
            throw new Error(`Method not implemented: ${methodName}`);
        }

        // Push stack frame (debugger)
        this.runtime.pushStack({
            type: "METHOD",
            class: instance.__class,
            method: methodName
        });

        try {
            // Execute method body
            await this.runtime.executor.executeBlock(
                method.body,
                this.runtime
            );
        } finally {
            this.runtime.popStack();
        }
    }

    /* =====================================================
     * DEBUG
     * ===================================================== */

    dump() {
        return Object.keys(this.classes);
    }
}

module.exports = ClassRegistry;
