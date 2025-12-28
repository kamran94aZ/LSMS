"use strict";

/**
 * ABAP Enterprise Parser – SELECT Grammar
 * --------------------------------------
 * Parses ABAP OPEN SQL SELECT statements
 *
 * SAP equivalent:
 * - Open SQL syntax parser
 */

const ParserUtils = require("../parserUtils");

module.exports = {

    parse(parser) {
        parser._expect("KEYWORD", "SELECT");

        /* ---------------------------------
         * FIELD LIST
         * --------------------------------- */
        const fields = [];

        if (parser._match("OPERATOR", "*")) {
            fields.push("*");
        } else {
            do {
                fields.push(parser._expect("IDENT").value);
            } while (parser._match("OPERATOR", ","));
        }

        /* ---------------------------------
         * FROM
         * --------------------------------- */
        parser._expect("KEYWORD", "FROM");
        const table = parser._expect("IDENT").value;

        /* ---------------------------------
         * INTO
         * --------------------------------- */
        let into = null;
        let intoTable = false;

        if (parser._match("KEYWORD", "INTO")) {
            if (parser._match("KEYWORD", "TABLE")) {
                intoTable = true;
            }
            into = parser._expect("IDENT").value;
        }

        /* ---------------------------------
         * WHERE
         * --------------------------------- */
        let where = null;
        if (parser._match("KEYWORD", "WHERE")) {
            where = ParserUtils.parseExpression(parser);
        }

        /* ---------------------------------
         * END
         * --------------------------------- */
        parser._expect("OPERATOR", ".");

        return {
            type: "SELECT",
            fields,
            table,
            into,
            intoTable,
            where
        };
    }
};
