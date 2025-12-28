"use strict";

/**
 * ABAP Enterprise Kernel – Expression Engine
 * -----------------------------------------
 * Evaluates ABAP expressions and conditions
 *
 * SAP equivalent:
 * - ABAP Expression Kernel
 * - IF / WHILE / CHECK evaluator
 */

class ExpressionEngine {

    constructor(types) {
        // ABAPTypes reference (for conversion rules)
        this.types = types;
    }

    /* =====================================================
     * PUBLIC ENTRY
     * ===================================================== */

    evaluate(expr, ctx) {
        switch (expr.type) {
            case "LITERAL":
                return expr.value;

            case "VARIABLE":
                return ctx.resolve(expr.name);

            case "BINARY":
                return this._binary(expr, ctx);

            case "UNARY":
                return this._unary(expr, ctx);

            case "BETWEEN":
                return this._between(expr, ctx);

            case "IN":
                return this._in(expr, ctx);

            case "IS_INITIAL":
                return this._isInitial(expr, ctx);

            case "PATTERN":
                return this._pattern(expr, ctx);

            default:
                throw new Error(`Unknown expression type: ${expr.type}`);
        }
    }

    /* =====================================================
     * BINARY EXPRESSIONS
     * ===================================================== */

    _binary(expr, ctx) {
        const left = this.evaluate(expr.left, ctx);
        const right = this.evaluate(expr.right, ctx);

        switch (expr.operator) {
            case "=":
                return left == right;

            case "<>":
                return left != right;

            case "<":
                return left < right;

            case ">":
                return left > right;

            case "<=":
                return left <= right;

            case ">=":
                return left >= right;

            case "AND":
                return Boolean(left) && Boolean(right);

            case "OR":
                return Boolean(left) || Boolean(right);

            default:
                throw new Error(`Unsupported operator: ${expr.operator}`);
        }
    }

    /* =====================================================
     * UNARY EXPRESSIONS
     * ===================================================== */

    _unary(expr, ctx) {
        const value = this.evaluate(expr.expr, ctx);

        switch (expr.operator) {
            case "NOT":
                return !Boolean(value);

            default:
                throw new Error(`Unsupported unary operator: ${expr.operator}`);
        }
    }

    /* =====================================================
     * IS INITIAL
     * ===================================================== */

    _isInitial(expr, ctx) {
        const value = this.evaluate(expr.expr, ctx);

        if (value === null || value === undefined) return true;

        if (typeof value === "string") {
            return value.trim() === "";
        }

        if (typeof value === "number") {
            return value === 0;
        }

        if (Array.isArray(value)) {
            return value.length === 0;
        }

        return false;
    }

    /* =====================================================
     * BETWEEN
     * ===================================================== */

    _between(expr, ctx) {
        const val = this.evaluate(expr.expr, ctx);
        const low = this.evaluate(expr.low, ctx);
        const high = this.evaluate(expr.high, ctx);

        return val >= low && val <= high;
    }

    /* =====================================================
     * IN
     * ===================================================== */

    _in(expr, ctx) {
        const val = this.evaluate(expr.expr, ctx);
        const list = expr.list.map(e => this.evaluate(e, ctx));
        return list.includes(val);
    }

    /* =====================================================
     * PATTERN MATCH (CP / NP)
     * ===================================================== */

    _pattern(expr, ctx) {
        const val = String(this.evaluate(expr.expr, ctx));
        const pat = String(expr.pattern)
            .replace(/\*/g, ".*")
            .replace(/\?/g, ".");

        const regex = new RegExp(`^${pat}$`);

        const match = regex.test(val);
        return expr.operator === "CP" ? match : !match;
    }
}

module.exports = ExpressionEngine;
