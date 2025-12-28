"use strict";

/**
 * ABAP Enterprise Parser – CLASS Grammar
 * -------------------------------------
 * Parses ABAP Objects syntax
 *
 * SAP equivalent:
 * - ABAP Objects syntax analyzer
 */

module.exports = {

    /* =====================================================
     * ENTRY
     * ===================================================== */

    parse(parser) {
        parser._expect("KEYWORD", "CLASS");

        const className = parser._expect("IDENT").value;

        if (parser._match("KEYWORD", "DEFINITION")) {
            return this.parseDefinition(parser, className);
        }

        if (parser._match("KEYWORD", "IMPLEMENTATION")) {
            return this.parseImplementation(parser, className);
        }

        throw parser._error("Expected DEFINITION or IMPLEMENTATION");
    },

    /* =====================================================
     * CLASS DEFINITION
     * ===================================================== */

    parseDefinition(parser, className) {
        parser._expect("OPERATOR", ".");

        const sections = {
            PUBLIC: [],
            PROTECTED: [],
            PRIVATE: []
        };

        let currentSection = "PUBLIC";

        while (true) {
            const t = parser._peek();

            if (t.type === "KEYWORD" &&
                ["PUBLIC", "PROTECTED", "PRIVATE"].includes(t.value)) {

                currentSection = parser._next().value;
                parser._expect("KEYWORD", "SECTION");
                parser._expect("OPERATOR", ".");
                continue;
            }

            if (t.type === "KEYWORD" && t.value === "METHODS") {
                parser._next(); // METHODS
                sections[currentSection].push(
                    this.parseMethodDeclaration(parser)
                );
                continue;
            }

            if (t.type === "KEYWORD" && t.value === "ENDCLASS") {
                parser._next();
                parser._expect("OPERATOR", ".");
                break;
            }

            throw parser._error("Unexpected token in CLASS DEFINITION");
        }

        return {
            type: "CLASS_DEFINITION",
            name: className,
            sections
        };
    },

    parseMethodDeclaration(parser) {
        const name = parser._expect("IDENT").value;
        parser._expect("OPERATOR", ".");

        return {
            type: "METHOD_DECL",
            name
        };
    },

    /* =====================================================
     * CLASS IMPLEMENTATION
     * ===================================================== */

    parseImplementation(parser, className) {
        parser._expect("OPERATOR", ".");

        const methods = [];

        while (true) {
            const t = parser._peek();

            if (t.type === "KEYWORD" && t.value === "METHOD") {
                methods.push(
                    this.parseMethodImplementation(parser)
                );
                continue;
            }

            if (t.type === "KEYWORD" && t.value === "ENDCLASS") {
                parser._next();
                parser._expect("OPERATOR", ".");
                break;
            }

            throw parser._error("Unexpected token in CLASS IMPLEMENTATION");
        }

        return {
            type: "CLASS_IMPLEMENTATION",
            name: className,
            methods
        };
    },

    parseMethodImplementation(parser) {
        parser._expect("KEYWORD", "METHOD");
        const name = parser._expect("IDENT").value;
        parser._expect("OPERATOR", ".");

        const body = [];
        while (!(parser._peek().type === "KEYWORD" &&
                 parser._peek().value === "ENDMETHOD")) {
            body.push(parser.parseStatement());
        }

        parser._expect("KEYWORD", "ENDMETHOD");
        parser._expect("OPERATOR", ".");

        return {
            type: "METHOD_IMPL",
            name,
            body
        };
    }
};
