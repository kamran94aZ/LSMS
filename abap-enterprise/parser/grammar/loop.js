"use strict";

/**
 * ABAP Enterprise Parser – Loop / Control Flow Grammar
 * ---------------------------------------------------
 * Parses IF / LOOP / DO / WHILE statements
 *
 * SAP equivalent:
 * - Control flow grammar
 */

const ParserUtils = require("../parserUtils");

module.exports = {

    /* =====================================================
     * ENTRY
     * ===================================================== */

    parse(parser) {
        const token = parser._peek();

        switch (token.value) {
            case "IF":
                return this.parseIf(parser);

            case "LOOP":
                return this.parseLoop(parser);

            case "DO":
                return this.parseDo(parser);

            case "WHILE":
                return this.parseWhile(parser);

            default:
                throw parser._error("Invalid loop/control statement");
        }
    },

    /* =====================================================
     * IF / ELSEIF / ELSE
     * ===================================================== */

    parseIf(parser) {
        parser._expect("KEYWORD", "IF");

        const condition = ParserUtils.parseExpression(parser);
        parser._expect("OPERATOR", ".");

        const then = [];
        const elseIfs = [];
        let elseBlock = null;

        while (true) {
            const next = parser._peek();

            if (next.type === "KEYWORD" && next.value === "ELSEIF") {
                parser._next(); // ELSEIF
                const cond = ParserUtils.parseExpression(parser);
                parser._expect("OPERATOR", ".");

                const body = [];
                while (!this._isBlockEnd(parser, ["ELSEIF", "ELSE", "ENDIF"])) {
                    body.push(parser.parseStatement());
                }

                elseIfs.push({
                    condition: cond,
                    then: body
                });
                continue;
            }

            if (next.type === "KEYWORD" && next.value === "ELSE") {
                parser._next(); // ELSE
                parser._expect("OPERATOR", ".");

                const body = [];
                while (!this._isBlockEnd(parser, ["ENDIF"])) {
                    body.push(parser.parseStatement());
                }

                elseBlock = body;
                continue;
            }

            if (next.type === "KEYWORD" && next.value === "ENDIF") {
                parser._next();
                parser._expect("OPERATOR", ".");
                break;
            }

            then.push(parser.parseStatement());
        }

        return {
            type: "IF",
            condition,
            then,
            elseIfs,
            else: elseBlock
        };
    },

    /* =====================================================
     * LOOP AT
     * ===================================================== */

    parseLoop(parser) {
        parser._expect("KEYWORD", "LOOP");
        parser._expect("KEYWORD", "AT");

        const table = parser._expect("IDENT").value;

        let into = null;
        if (parser._match("KEYWORD", "INTO")) {
            into = parser._expect("IDENT").value;
        }

        parser._expect("OPERATOR", ".");

        const body = [];
        while (!this._isBlockEnd(parser, ["ENDLOOP"])) {
            body.push(parser.parseStatement());
        }

        parser._expect("KEYWORD", "ENDLOOP");
        parser._expect("OPERATOR", ".");

        return {
            type: "LOOP",
            table,
            into,
            body
        };
    },

    /* =====================================================
     * DO ... TIMES
     * ===================================================== */

    parseDo(parser) {
        parser._expect("KEYWORD", "DO");

        let times = null;
        if (!parser._match("KEYWORD", "TIMES")) {
            times = ParserUtils.parseExpression(parser);
            parser._expect("KEYWORD", "TIMES");
        }

        parser._expect("OPERATOR", ".");

        const body = [];
        while (!this._isBlockEnd(parser, ["ENDDO"])) {
            body.push(parser.parseStatement());
        }

        parser._expect("KEYWORD", "ENDDO");
        parser._expect("OPERATOR", ".");

        return {
            type: "DO",
            times,
            body
        };
    },

    /* =====================================================
     * WHILE
     * ===================================================== */

    parseWhile(parser) {
        parser._expect("KEYWORD", "WHILE");

        const condition = ParserUtils.parseExpression(parser);
        parser._expect("OPERATOR", ".");

        const body = [];
        while (!this._isBlockEnd(parser, ["ENDWHILE"])) {
            body.push(parser.parseStatement());
        }

        parser._expect("KEYWORD", "ENDWHILE");
        parser._expect("OPERATOR", ".");

        return {
            type: "WHILE",
            condition,
            body
        };
    },

    /* =====================================================
     * HELPERS
     * ===================================================== */

    _isBlockEnd(parser, keywords) {
        const t = parser._peek();
        return t && t.type === "KEYWORD" && keywords.includes(t.value);
    }
};
