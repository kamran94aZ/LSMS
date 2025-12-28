"use strict";

/**
 * ABAP AST – ClassNode
 * -------------------
 * Represents an ABAP Class (Definition + Implementation)
 *
 * ABAP:
 *   CLASS ... DEFINITION.
 *   CLASS ... IMPLEMENTATION.
 */

class ClassNode {

    constructor(name, meta = {}) {
        this.type = "CLASS";

        this.name = name;

        // Definition part
        this.sections = {
            PUBLIC: [],
            PROTECTED: [],
            PRIVATE: []
        };

        // Implementation part
        this.methods = Object.create(null);

        // Source mapping (IDE / Debugger)
        this.meta = {
            line: meta.line ?? null,
            column: meta.column ?? null
        };
    }

    /* =====================================================
     * DEFINITION HANDLING
     * ===================================================== */

    addMethodDeclaration(section, methodName) {
        if (!this.sections[section]) {
            throw new Error(`Invalid visibility section: ${section}`);
        }

        this.sections[section].push({
            type: "METHOD_DECL",
            name: methodName
        });
    }

    /* =====================================================
     * IMPLEMENTATION HANDLING
     * ===================================================== */

    addMethodImplementation(methodName, body) {
        this.methods[methodName] = {
            type: "METHOD_IMPL",
            name: methodName,
            body
        };
    }

    /* =====================================================
     * RUNTIME REGISTRATION
     * ===================================================== */

    register(runtime) {
        // Register definition
        runtime.classRegistry.define(
            this.name,
            this.sections
        );

        // Register implementation
        const implList = Object.values(this.methods);
        runtime.classRegistry.implement(
            this.name,
            implList
        );
    }

    /* =====================================================
     * DEBUG REPRESENTATION
     * ===================================================== */

    toString() {
        const pub = this.sections.PUBLIC.length;
        const prot = this.sections.PROTECTED.length;
        const priv = this.sections.PRIVATE.length;

        return `CLASS ${this.name} (PUB:${pub}, PROT:${prot}, PRIV:${priv})`;
    }
}

module.exports = ClassNode;
