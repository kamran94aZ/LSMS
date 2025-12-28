"use strict";

/**
 * CTS Version Control
 * -------------------
 * Manages object version history
 *
 * SAP equivalent:
 * - Version Management
 */

class VersionControl {

    constructor() {
        // objectKey -> [versions]
        this.history = Object.create(null);
    }

    _key(type, name) {
        return `${type}:${name}`;
    }

    /* =====================================================
     * COMMIT
     * ===================================================== */

    commit(type, name, payload, message = "") {
        const key = this._key(type, name);

        if (!this.history[key]) {
            this.history[key] = [];
        }

        this.history[key].push({
            version: this.history[key].length + 1,
            payload: JSON.parse(JSON.stringify(payload)),
            message,
            timestamp: new Date()
        });
    }

    /* =====================================================
     * GET HISTORY
     * ===================================================== */

    getHistory(type, name) {
        return this.history[this._key(type, name)] || [];
    }

    /* =====================================================
     * GET VERSION
     * ===================================================== */

    getVersion(type, name, version) {
        return this.getHistory(type, name)
            .find(v => v.version === version) || null;
    }
}

module.exports = VersionControl;
