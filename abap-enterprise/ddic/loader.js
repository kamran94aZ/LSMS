"use strict";

/**
 * DDIC Loader
 * -----------
 * Loads and manages Data Dictionary objects
 *
 * SAP equivalent:
 * - DDIC Runtime
 * - Dictionary Buffer
 */

const fs = require("fs");
const path = require("path");

class DDIC {

    constructor(basePath) {
        this.basePath = basePath;

        this.tables = Object.create(null);
        this.views = Object.create(null);
        this.domains = Object.create(null);
        this.elements = Object.create(null);
    }

    /* =====================================================
     * LOAD ALL
     * ===================================================== */

    loadAll() {
        this._loadDir("tables", this.tables);
        this._loadDir("views", this.views);
        this._loadDir("domains", this.domains);
        this._loadDir("elements", this.elements);
    }

    /* =====================================================
     * LOAD DIRECTORY
     * ===================================================== */

    _loadDir(dirName, target) {
        const dir = path.join(this.basePath, dirName);
        if (!fs.existsSync(dir)) return;

        for (const file of fs.readdirSync(dir)) {
            if (!file.endsWith(".json")) continue;

            const name = path.basename(file, ".json").toUpperCase();
            const fullPath = path.join(dir, file);

            const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));
            target[name] = json;
        }
    }

    /* =====================================================
     * LOOKUPS
     * ===================================================== */

    getTable(name) {
        return this.tables[name.toUpperCase()] || null;
    }

    getView(name) {
        return this.views[name.toUpperCase()] || null;
    }

    getDomain(name) {
        return this.domains[name.toUpperCase()] || null;
    }

    getElement(name) {
        return this.elements[name.toUpperCase()] || null;
    }
}

module.exports = DDIC;
