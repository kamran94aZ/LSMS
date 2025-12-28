"use strict";

/**
 * ABAP Enterprise Parser – Parser Utilities
 * -----------------------------------------
 * Shared helper functions for grammar modules
 *
 * SAP equivalent:
 * - Syntax helper utilities
 * - AST builder helpers
 */

const ExpressionGrammar = require("./grammar/expressions");

class ParserUtils {

    /* =====================================================
     * EXPRESSION
     * ===================================================== */

    static parseExpression(parser) {
        return ExpressionGrammar.parse(parser);
    }

    /* =====================================================
     * AST NODE FACTORY
     * (future-proof for class-based AST)
     * ===================================================== */

    static createNode(type, props = {}, meta = {}) {
        return {
            type,
            ...props,
            __meta: {
                line: meta.line ?? null,
                column: meta.column ?? null
            }
        };
    }

    /* =====================================================
     * SOURCE POSITION (IDE / DEBUGGER)
     * ===================================================== */

    static capturePosition(parser) {
        const token = parser._peek();
        if (!token) return { line: null, column: null };

        return {
            line: token.line ?? null,
            column: token.column ?? null
        };
    }

    /* =====================================================
     * EXPECT STATEMENT END
     * ===================================================== */

    static expectDot(parser) {
        parser._expect("OPERATOR", ".");
    }
}

module.exports = ParserUtils;
