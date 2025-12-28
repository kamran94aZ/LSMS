"use strict";

/**
 * ABAP Enterprise Parser – Main Parser
 * -----------------------------------
 * Converts token stream into AST
 *
 * SAP equivalent:
 * - ABAP Syntax Analyzer
 * - Statement dispatcher
 */

const ParserUtils = require("./parserUtils");

// Grammar modules
const stmtGrammar = require("./grammar/statements");
const dataGrammar = require("./grammar/data");
const exprGrammar = require("./grammar/expressions");
const selectGrammar = require("./grammar/select");
const loopGrammar = require("./grammar/loop");
const classGrammar = require("./grammar/class");

class ABAPParser {

    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    /* =====================================================
     * ENTRY POINT
     * ===================================================== */

    parseProgram() {
        const body = [];

        while (!this._eof()) {
            const stmt = this.parseStatement();
            if (stmt) {
                body.push(stmt);
            }
        }

        return {
            type: "PROGRAM",
            body
        };
    }

    /* =====================================================
     * STATEMENT DISPATCHER
     * ===================================================== */

    parseStatement() {
        const token = this._peek();

        if (!token) return null;

        if (token.type === "KEYWORD") {
            switch (token.value) {

                // DATA / TYPES
                case "DATA":
                case "TYPES":
                    return dataGrammar.parse(this);

                // IF / LOOP / DO / WHILE
                case "IF":
                case "DO":
                case "WHILE":
                case "LOOP":
                    return loopGrammar.parse(this);

                // SELECT
                case "SELECT":
                    return selectGrammar.parse(this);

                // CLASS / METHOD
                case "CLASS":
                    return classGrammar.parse(this);

                // WRITE
                case "WRITE":
                    return stmtGrammar.parseWrite(this);

                // CONTROL
                case "EXIT":
                case "CONTINUE":
                case "CHECK":
                    return stmtGrammar.parseControl(this);

                default:
                    throw this._error(`Unexpected keyword ${token.value}`);
            }
        }

        throw this._error(`Unexpected token ${token.type}`);
    }

    /* =====================================================
     * TOKEN HELPERS
     * ===================================================== */

    _peek(offset = 0) {
        return this.tokens[this.pos + offset];
    }

    _next() {
        return this.tokens[this.pos++];
    }

    _expect(type, value = null) {
        const token = this._next();

        if (!token || token.type !== type ||
            (value && token.value !== value)) {
            throw this._error(
                `Expected ${type}${value ? " " + value : ""}`
            );
        }

        return token;
    }

    _match(type, value = null) {
        const token = this._peek();
        if (!token) return false;

        if (token.type === type &&
            (!value || token.value === value)) {
            this.pos++;
            return true;
        }

        return false;
    }

    _eof() {
        return this.pos >= this.tokens.length;
    }

    /* =====================================================
     * ERROR HANDLING
     * ===================================================== */

    _error(msg) {
        return new SyntaxError(
            `${msg} at token ${this.pos}`
        );
    }
}

module.exports = ABAPParser;
