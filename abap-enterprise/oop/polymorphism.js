"use strict";

/**
 * ABAP OOP – Polymorphism Engine
 * -----------------------------
 * Handles dynamic method dispatch based on runtime type
 *
 * SAP equivalent:
 * - Dynamic Dispatch Engine
 * - Polymorphic Method Resolver
 */

class PolymorphismEngine {

    constructor(classRegistry, methodTable) {
        this.classRegistry = classRegistry;
        this.methodTable = methodTable;
    }

    /* =====================================================
     * DYNAMIC METHOD RESOLUTION
     * ===================================================== */

    resolve(ref, methodName) {
        if (!ref || !ref.__class) {
            throw new Error("Invalid object reference");
        }

        const className = ref.__class;

        const resolved = this.methodTable.resolveInstanceMethod(
            className,
            methodName
        );

        if (!resolved) {
            throw new Error(
                `Method ${methodName} not found in class ${className}`
            );
        }

        return resolved;
    }

    /* =====================================================
     * INSTANCE CHECK
     * ===================================================== */

    isInstanceOf(ref, typeName) {
        if (!ref || !ref.__class) return false;

        let cls = this.classRegistry.getClass(ref.__class);

        while (cls) {
            // Direct class match
            if (cls.name === typeName) {
                return true;
            }

            // Interface match
            if (cls.interfaces && cls.interfaces.includes(typeName)) {
                return true;
            }

            cls = cls.superClass
                ? this.classRegistry.getClass(cls.superClass)
                : null;
        }

        return false;
    }
}

module.exports = PolymorphismEngine;
