"use strict";

/**
 * Transport Importer
 * ------------------
 * Imports a transport package into a target repository
 */

class ImportTR {

    constructor(targetRepository, versionControl) {
        this.repo = targetRepository;
        this.vc = versionControl;
    }

    import(pkg) {
        for (const obj of pkg.objects) {
            this.repo.register(
                obj.type,
                obj.name,
                JSON.parse(JSON.stringify(obj.payload))
            );

            this.vc.commit(
                obj.type,
                obj.name,
                obj.payload,
                `Imported via TR ${pkg.trId}`
            );
        }

        return {
            trId: pkg.trId,
            importedAt: new Date(),
            objects: pkg.objects.length
        };
    }
}

module.exports = ImportTR;
