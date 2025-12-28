"use strict";

/**
 * ABAP OOP – Class Registry (Enterprise)
 * -------------------------------------
 * Stores class metadata, inheritance, interfaces
 *
 * SAP equivalent:
 * - ABAP Objects Class Loader
 * - Class Descriptor
 */

class OOPClassRegistry {

    constructor() {
        // className -> classDescriptor
        this.classes = Object.create(null);

        // interfaceName -> interfaceDescriptor
        this.interfaces = Object.create(null);
    }

    /* =====================================================
     * CLASS REGISTRATION
     * ===================================================== */

    registerClass(descriptor) {
        const name = descriptor.name;

        if (this.classes[name]) {
            throw new Error(`Class already exists: ${name}`);
        }

        this.classes[name] = {
            name,
            superClass: descriptor.superClass || null,
            interfaces: descriptor.interfaces || [],
            methods: descriptor.methods || {},
            attributes: descriptor.attributes || {},
            constructor: descriptor.constructor || null
        };
    }

    /* =====================================================
     * INTERFACE REGISTRATION
     * ===================================================== */

    registerInterface(descriptor) {
        const name = descriptor.name;

        if (this.interfaces[name]) {
            throw new Error(`Interface already exists: ${name}`);
        }

        this.interfaces[name] = {
            name,
            methods: descriptor.methods || []
        };
    }

    /* =====================================================
     * LOOKUP
     * ===================================================== */

    getClass(name) {
        return this.classes[name] || null;
    }

    getInterface(name) {
        return this.interfaces[name] || null;
    }

    /* =====================================================
     * DEBUG
     * ===================================================== */

    dump() {
        return {
            classes: Object.keys(this.classes),
            interfaces: Object.keys(this.interfaces)
        };
    }
}

module.exports = OOPClassRegistry;
