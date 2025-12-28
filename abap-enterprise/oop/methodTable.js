"use strict";

/**
 * ABAP OOP – Method Table
 * ----------------------
 * Resolves methods with inheritance and overriding
 *
 * SAP equivalent:
 * - Method Resolution Table (MRT)
 */

class MethodTable {

    constructor(classRegistry) {
        this.classRegistry = classRegistry;
    }

    /* =====================================================
     * RESOLVE INSTANCE METHOD
     * ===================================================== */

    resolveInstanceMethod(className, methodName) {
        let cls = this.classRegistry.getClass(className);

        while (cls) {
            if (cls.methods && cls.methods[methodName]) {
                return {
                    className: cls.name,
                    method: cls.methods[methodName]
                };
            }

            // Walk up inheritance chain
            if (!cls.superClass) break;
            cls = this.classRegistry.getClass(cls.superClass);
        }

        return null;
    }

    /* =====================================================
     * CHECK INTERFACE IMPLEMENTATION
     * ===================================================== */

    implementsInterface(className, interfaceName) {
        let cls = this.classRegistry.getClass(className);

        while (cls) {
            if (cls.interfaces && cls.interfaces.includes(interfaceName)) {
                return true;
            }
            if (!cls.superClass) break;
            cls = this.classRegistry.getClass(cls.superClass);
        }

        return false;
    }

    /* =====================================================
     * DEBUG
     * ===================================================== */

    dump(className) {
        const methods = [];

        let cls = this.classRegistry.getClass(className);
        while (cls) {
            if (cls.methods) {
                for (const m in cls.methods) {
                    methods.push(`${cls.name}->${m}`);
                }
            }
            cls = cls.superClass
                ? this.classRegistry.getClass(cls.superClass)
                : null;
        }

        return methods;
    }
}

module.exports = MethodTable;
