"use strict";

/**
 * IDE Syntax Checker
 * ------------------
 * Validates ABAP syntax using parser
 */

class SyntaxChecker {

    constructor(parser) {
        this.parser = parser;
    }

    check(code) {
        try {
            this.parser.parse(code);
            return { ok: true, errors: [] };
        } catch (e) {
            return {
                ok: false,
                errors: [{
                    message: e.message,
                    line: e.line || null
                }]
            };
        }
    }
}

module.exports = SyntaxChecker;
