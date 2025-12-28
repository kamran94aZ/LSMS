"use strict";

/**
 * ABAP OOP – Class Builder
 * -----------------------
 * Builds class descriptors from CLASS DEFINITION AST
 *
 * SAP equivalent:
 * - Class Definition Builder
 * - Class Descriptor Generator
 */

class ClassBuilder {

    constructor(classRegistry) {
        this.classRegistry = classRegistry;
    }

    /* =====================================================
     * BUILD CLASS
     * ===================================================== */

    build(definitionNode) {
        const className = definitionNode.name;

        const descriptor = {
            name: className,
            superClass: null,
            interfaces: [],
            methods: {},
            attributes: {},
            constructor: null
        };

        /* ---------------------------------
         * INHERITANCE
         * --------------------------------- */
        if (definitionNode.superClass) {
            descriptor.superClass = definitionNode.superClass;
        }

        /* ---------------------------------
         * INTERFACES
         * --------------------------------- */
        if (definitionNode.interfaces) {
            descriptor.interfaces = definitionNode.interfaces.slice();
        }

        /* ---------------------------------
         * SECTIONS (PUBLIC / PROTECTED / PRIVATE)
         * --------------------------------- */
        for (const section of ["PUBLIC", "PROTECTED", "PRIVATE"]) {
            const entries = definitionNode.sections[section] || [];

            for (const entry of entries) {

                // METHOD declaration
                if (entry.type === "METHOD_DECL") {
                    descriptor.methods[entry.name] = {
                        name: entry.name,
                        visibility: section,
                        body: null
                    };
                }

                // ATTRIBUTE declaration (future)
                if (entry.type === "ATTRIBUTE_DECL") {
                    descriptor.attributes[entry.name] = {
                        name: entry.name,
                        visibility: section,
                        type: entry.dataType
                    };
                }
            }
        }

        /* ---------------------------------
         * REGISTER CLASS
         * --------------------------------- */
        this.classRegistry.registerClass(descriptor);

        return descriptor;
    }
}

module.exports = ClassBuilder;
