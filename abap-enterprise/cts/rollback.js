"use strict";

/**
 * CTS Rollback Engine
 * -------------------
 * Rolls back objects to previous versions
 *
 * SAP equivalent:
 * - Version Rollback
 */

class RollbackEngine {

    constructor(repository, versionControl) {
        this.repository = repository;
        this.versionControl = versionControl;
    }

    rollback(type, name, version) {
        const v = this.versionControl.getVersion(type, name, version);
        if (!v) {
            throw new Error(
                `Version not found: ${type} ${name} v${version}`
            );
        }

        this.repository.register(
            type,
            name,
            JSON.parse(JSON.stringify(v.payload))
        );

        return {
            type,
            name,
            restoredVersion: version
        };
    }
}

module.exports = RollbackEngine;
