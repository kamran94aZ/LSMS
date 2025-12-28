"use strict";

/**
 * ABAP Enterprise Parser – DATA / TYPES Grammar
 * --------------------------------------------
 * Parses DATA and TYPES statements
 *
 * SAP equivalent:
 * - DATA declaration grammar
 * - TYPES definition grammar
 */

const ParserUtils = require("../parserUtils");

module.exports = {

    /* =====================================================
     * ENTRY
     * ===================================================== */

    parse(parser) {
        const keyword = parser._next().value; // DATA or TYPES

        if (keyword === "DATA") {
            return this.parseData(parser);
        }

        if (keyword === "TYPES") {
            return this.parseTypes(parser);
        }

        throw parser._error("Invalid DATA/TYPES statement");
    },

    /* =====================================================
     * DATA
     * ===================================================== */

    parseData(parser) {
        const declarations = [];

        // DATA:
        if (parser._match("OPERATOR", ":")) {
            do {
                declarations.push(this.parseSingleData(parser));
            } while (parser._match("OPERATOR", ","));
        } else {
            declarations.push(this.parseSingleData(parser));
        }

        parser._expect("OPERATOR", ".");

        return {
            type: "DATA",
            declarations
        };
    },

    parseSingleData(parser) {
        // variable name
        const name = parser._expect("IDENT").value;

        parser._expect("KEYWORD", "TYPE");

        const typeToken = parser._expect("IDENT");

        let length = null;

        if (parser._match("KEYWORD", "LENGTH")) {
            length = parser._expect("NUMBER").value;
        }

        return {
            name,
            dataType: typeToken.value.toUpperCase(),
            length
        };
    },

    /* =====================================================
     * TYPES
     * ===================================================== */

    parseTypes(parser) {

        // TYPES BEGIN OF
        parser._expect("KEYWORD", "BEGIN");
        parser._expect("KEYWORD", "OF");

        const typeName = parser._expect("IDENT").value;

        parser._expect("OPERATOR", ",");

        const fields = [];

        while (!parser._match("KEYWORD", "END")) {

            const fieldName = parser._expect("IDENT").value;
            parser._expect("KEYWORD", "TYPE");
            const fieldType = parser._expect("IDENT").value;

            let length = null;
            if (parser._match("KEYWORD", "LENGTH")) {
                length = parser._expect("NUMBER").value;
            }

            fields.push({
                name: fieldName,
                type: fieldType.toUpperCase(),
                length
            });

            parser._match("OPERATOR", ",");
        }

        parser._expect("KEYWORD", "OF");
        parser._expect("IDENT", typeName);
        parser._expect("OPERATOR", ".");

        return {
            type: "TYPES",
            name: typeName,
            fields
        };
    }
};
