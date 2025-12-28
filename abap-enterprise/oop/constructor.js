"use strict";

/**
 * ABAP OOP – Constructor Handler
 * ------------------------------
 * Handles constructor execution and inheritance chaining
 *
 * SAP equivalent:
 * - ABAP Object Constructor Manager
 */

class ConstructorHandler {

    constructor(classRegistry, methodTable) {
        this.classRegistry = classRegistry;
        this.methodTable = methodTable;
    }

    /* =====================================================
     * RUN CONSTRUCTOR CHAIN
     * ===================================================== */

    async run(instance, runtime) {
        const classChain = this._buildClassChain(instance.__class);

        // ABAP rule:
        // Constructors are executed from top (super) to bottom (child)
        for (const className of classChain) {
            const resolved = this.methodTable.resolveInstanceMethod(
                className,
                "constructor"
            );

            if (resolved) {
                const { method } = resolved;

                runtime.pushStack({
                    type: "CONSTRUCTOR",
                    class: className
                });

                try {
                    await runtime.executor.executeBlock(
                        method.body,
                        runtime
                    );
                } finally {
                    runtime.popStack();
                }
            }
        }
    }

    /* =====================================================
     * BUILD INHERITANCE CHAIN
     * ===================================================== */

    _buildClassChain(className) {
        const chain = [];

        let cls = this.classRegistry.getClass(className);
        while (cls) {
            chain.unshift(cls.name);
            cls = cls.superClass
                ? this.classRegistry.getClass(cls.superClass)
                : null;
        }

        return chain;
    }
}

module.exports = ConstructorHandler;
