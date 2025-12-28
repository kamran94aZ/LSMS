"use strict";

/**
 * ABAP Enterprise Parser – Expression Grammar
 * ------------------------------------------
 * Parses ABAP expressions into AST
 *
 * SAP equivalent:
 * - Expression syntax analyzer
 */

module.exports = {

    /* =====================================================
     * ENTRY POINT
     * ===================================================== */

    parse(parser) {
        return this.parseOr(parser);
    },

    /* =====================================================
     * OR
     * ===================================================== */

    parseOr(parser) {
        let left = this.parseAnd(parser);

        while (parser._match("KEYWORD", "OR")) {
            const right = this.parseAnd(parser);
            left = {
                type: "BINARY",
                operator: "OR",
                left,
                right
            };
        }

        return left;
    },

    /* =====================================================
     * AND
     * ===================================================== */

    parseAnd(parser) {
        let left = this.parseNot(parser);

        while (parser._match("KEYWORD", "AND")) {
            const right = this.parseNot(parser);
            left = {
                type: "BINARY",
                operator: "AND",
                left,
                right
            };
        }

        return left;
    },

    /* =====================================================
     * NOT
     * ===================================================== */

    parseNot(parser) {
        if (parser._match("KEYWORD", "NOT")) {
            return {
                type: "UNARY",
                operator: "NOT",
                expr: this.parseComparison(parser)
            };
        }
        return this.parseComparison(parser);
    },

    /* =====================================================
     * COMPARISON
     * ===================================================== */

    parseComparison(parser) {
        let left = this.parsePrimary(parser);

        // IS [NOT] INITIAL
        if (parser._match("KEYWORD", "IS")) {
            const not = parser._match("KEYWORD", "NOT");
            parser._expect("KEYWORD", "INITIAL");

            return {
                type: "IS_INITIAL",
                expr: left,
                negate: not
            };
        }

        // BETWEEN
        if (parser._match("KEYWORD", "BETWEEN")) {
            const low = this.parsePrimary(parser);
            parser._expect("KEYWORD", "AND");
            const high = this.parsePrimary(parser);

            return {
                type: "BETWEEN",
                expr: left,
                low,
                high
            };
        }

        // IN (...)
        if (parser._match("KEYWORD", "IN")) {
            parser._expect("OPERATOR", "(");

            const list = [];
            do {
                list.push(this.parsePrimary(parser));
            } while (parser._match("OPERATOR", ","));

            parser._expect("OPERATOR", ")");

            return {
                type: "IN",
                expr: left,
                list
            };
        }

        // Binary comparison operators
        const ops = ["=", "<>", "<", ">", "<=", ">="];
        const token = parser._peek();

        if (token && token.type === "OPERATOR" && ops.includes(token.value)) {
            parser._next();
            const right = this.parsePrimary(parser);

            return {
                type: "BINARY",
                operator: token.value,
                left,
                right
            };
        }

        return left;
    },

    /* =====================================================
     * PRIMARY
     * ===================================================== */

    parsePrimary(parser) {
        const token = parser._next();

        if (!token) {
            throw parser._error("Unexpected end of expression");
        }

        // NUMBER
        if (token.type === "NUMBER") {
            return {
                type: "LITERAL",
                value: token.value
            };
        }

        // STRING
        if (token.type === "STRING") {
            return {
                type: "LITERAL",
                value: token.value
            };
        }

        // IDENTIFIER (variable)
        if (token.type === "IDENT") {
            return {
                type: "VARIABLE",
                name: token.value
            };
        }

        // Parenthesized expression
        if (token.type === "OPERATOR" && token.value === "(") {
            const expr = this.parse(parser);
            parser._expect("OPERATOR", ")");
            return expr;
        }

        throw parser._error(`Unexpected token in expression: ${token.type}`);
    }
};
