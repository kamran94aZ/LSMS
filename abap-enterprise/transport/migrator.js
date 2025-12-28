"use strict";

/**
 * Transport Migrator
 * ------------------
 * Orchestrates export, queue and import of transports
 */

const ExportTR = require("./exportTR");
const ImportTR = require("./importTR");

class TransportMigrator {

    constructor(sourceRepo, targetRepo, versionControl) {
        this.exporter = new ExportTR(sourceRepo);
        this.importer = new ImportTR(targetRepo, versionControl);
    }

    migrate(tr) {
        // Export
        const pkg = this.exporter.export(tr);

        // Import
        return this.importer.import(pkg);
    }
}

module.exports = TransportMigrator;
