"use strict";

/**
 * ABAP OOP – Runtime Type Information (RTTI)
 * -----------------------------------------
 * Provides runtime type metadata for objects, classes and interfaces
 *
 * SAP equivalent:
 * - CL_ABAP_TYPEDESCR
 * - CL_ABAP_CLASSDESCR
 * - CL_ABAP_OBJECTDESCR
 */

class RTTI {

    constructor(classRegistry, methodTable) {
        this.classRegistry = classRegistry;
        this.methodTable = methodTable;
    }

    /* =====================================================
     * OBJECT DESCRIPTOR
     * ===================================================== */

    describeObject(ref) {
        if (!ref || !ref.__class) {
            return null;
        }

        return this.describeClass(ref.__class);
    }

    /* =====================================================
     * CLASS DESCRIPTOR
     * ===================================================== */

    describeClass(className) {
        const cls = this.classRegistry.getClass(className);
        if (!cls) return null;

        return {
            name: cls.name,
            superClass: cls.superClass,
            interfaces: cls.interfaces || [],
            attributes: Object.keys(cls.attributes || {}),
            methods: this.methodTable.dump(cls.name)
        };
    }

    /* =====================================================
     * INTERFACE DESCRIPTOR
     * ===================================================== */

    describeInterface(interfaceName) {
        const intf = this.classRegistry.getInterface(interfaceName);
        if (!intf) return null;

        return {
            name: intf.name,
            methods: intf.methods.map(m => m.name)
        };
    }

    /* =====================================================
     * TYPE CHECK
     * ===================================================== */

    isInstanceOf(ref, typeName) {
        if (!ref || !ref.__class) return false;

        let cls = this.classRegistry.getClass(ref.__class);
        while (cls) {
            if (cls.name === typeName) return true;
            if (cls.interfaces && cls.interfaces.includes(typeName)) {
                return true;
            }
            cls = cls.superClass
                ? this.classRegistry.getClass(cls.superClass)
                : null;
        }
        return false;
    }

    /* =====================================================
     * DEBUG
     * ===================================================== */

    dump() {
        return {
            classes: Object.keys(this.classRegistry.classes),
            interfaces: Object.keys(this.classRegistry.interfaces)
        };
    }
}

module.exports = RTTI;
