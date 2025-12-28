"use strict";

/**
 * IDE Metadata Provider
 * ---------------------
 * Supplies keywords, DDIC objects, classes and methods
 */

class MetadataProvider {

    constructor(ddic, classRegistry) {
        this.ddic = ddic;
        this.classRegistry = classRegistry;
    }

    getKeywords() {
        return [
            "REPORT", "DATA", "SELECT", "FROM", "WHERE",
            "IF", "ELSE", "ENDIF", "LOOP", "ENDLOOP",
            "CLASS", "METHOD", "ENDMETHOD",
            "TRY", "CATCH", "ENDTRY"
        ];
    }

    getTables() {
        return Object.keys(this.ddic.tables);
    }

    getDomains() {
        return Object.keys(this.ddic.domains);
    }

    getElements() {
        return Object.keys(this.ddic.elements);
    }

    getClasses() {
        return Object.keys(this.classRegistry.classes);
    }

    getClassMethods(className) {
        const cls = this.classRegistry.getClass(className);
        if (!cls) return [];
        return Object.keys(cls.methods || {});
    }
}

module.exports = MetadataProvider;
