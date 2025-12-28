"use strict";

/**
 * ABAP OOP – Interface Builder
 * ---------------------------
 * Builds interface descriptors from INTERFACE AST
 *
 * SAP equivalent:
 * - ABAP Interface Loader
 * - Interface Descriptor Generator
 */

class InterfaceBuilder {

    constructor(classRegistry) {
        this.classRegistry = classRegistry;
    }

    /* =====================================================
     * BUILD INTERFACE
     * ===================================================== */

    build(interfaceNode) {
        const name = interfaceNode.name;

        const descriptor = {
            name,
            methods: []
        };

        /* ---------------------------------
         * METHODS
         * --------------------------------- */
        for (const method of interfaceNode.methods || []) {
            descriptor.methods.push({
                name: method.name
            });
        }

        /* ---------------------------------
         * REGISTER INTERFACE
         * --------------------------------- */
        this.classRegistry.registerInterface(descriptor);

        return descriptor;
    }
}

module.exports = InterfaceBuilder;
