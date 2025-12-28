"use strict";

/**
 * ABAP Runtime – Object Manager
 * -----------------------------
 * Handles object instances and references
 *
 * SAP equivalent:
 * - ABAP Object Instance Manager
 */

const {
    CX_SY_REF_IS_INITIAL
} = require("./errorHandler");

class ObjectManager {

    constructor(classRegistry) {
        this.classRegistry = classRegistry;

        // objectId -> instance
        this.instances = new Map();
        this.nextId = 1;
    }

    /* =====================================================
     * CREATE OBJECT
     * ===================================================== */

    create(className) {
        const instance = this.classRegistry.createInstance(className);

        const id = this.nextId++;
        instance.__objectId = id;

        this.instances.set(id, instance);

        return instance;
    }

    /* =====================================================
     * REFERENCE CHECK
     * ===================================================== */

    ensureNotInitial(ref) {
        if (!ref || !ref.__objectId) {
            throw new CX_SY_REF_IS_INITIAL();
        }
    }

    /* =====================================================
     * OBJECT ACCESS
     * ===================================================== */

    getObject(ref) {
        this.ensureNotInitial(ref);

        const obj = this.instances.get(ref.__objectId);
        if (!obj) {
            throw new CX_SY_REF_IS_INITIAL();
        }
        return obj;
    }

    /* =====================================================
     * DEBUG / GC
     * ===================================================== */

    dump() {
        return Array.from(this.instances.keys());
    }

    clear() {
        this.instances.clear();
    }
}

module.exports = ObjectManager;
