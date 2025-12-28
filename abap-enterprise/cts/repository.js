"use strict";

/**
 * CTS Repository
 * --------------
 * Central storage for all ABAP artifacts
 *
 * SAP equivalent:
 * - ABAP Repository (TADIR)
 */

class Repository {

    constructor() {
        // objectType -> name -> object
        this.objects = Object.create(null);
    }

    /* =====================================================
     * REGISTER OBJECT
     * ===================================================== */

    register(type, name, payload) {
        type = type.toUpperCase();
        name = name.toUpperCase();

        if (!this.objects[type]) {
            this.objects[type] = Object.create(null);
        }

        this.objects[type][name] = {
            type,
            name,
            payload,
            createdAt: new Date()
        };
    }

    /* =====================================================
     * READ OBJECT
     * ===================================================== */

    get(type, name) {
        return this.objects[type?.toUpperCase()]?.[name?.toUpperCase()] || null;
    }

    /* =====================================================
     * DELETE OBJECT
     * ===================================================== */

    remove(type, name) {
        if (this.objects[type]) {
            delete this.objects[type][name];
        }
    }

    /* =====================================================
     * LIST
     * ===================================================== */

    list(type) {
        if (!type) return this.objects;
        return Object.keys(this.objects[type] || {});
    }
}

module.exports = Repository;
