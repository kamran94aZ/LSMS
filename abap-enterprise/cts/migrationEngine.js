"use strict";

/**
 * CTS Migration Engine
 * --------------------
 * Imports Transport Requests into target systems
 *
 * SAP equivalent:
 * - Transport Import Engine
 */

class MigrationEngine {

    constructor(sourceRepo, targetRepo, versionControl) {
        this.sourceRepo = sourceRepo;
        this.targetRepo = targetRepo;
        this.versionControl = versionControl;
    }

    importTR(tr) {
        if (tr.status !== "RELEASED") {
            throw new Error(`TR not released: ${tr.id}`);
        }

        for (const objRef of tr.objects) {
            const srcObj = this.sourceRepo.get(objRef.type, objRef.name);
            if (!srcObj) {
                throw new Error(
                    `Source object missing: ${objRef.type} ${objRef.name}`
                );
            }

            // Apply object to target repo
            this.targetRepo.register(
                srcObj.type,
                srcObj.name,
                JSON.parse(JSON.stringify(srcObj.payload))
            );

            // Record version on target
            this.versionControl.commit(
                srcObj.type,
                srcObj.name,
                srcObj.payload,
                `Imported via ${tr.id}`
            );
        }

        tr.importedAt = new Date();
        tr.status = "IMPORTED";
    }
}

module.exports = MigrationEngine;
