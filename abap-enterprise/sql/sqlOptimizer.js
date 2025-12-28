"use strict";

/**
 * SQL Optimizer
 * -------------
 * Optimizes logical SQL execution plans
 *
 * SAP equivalent:
 * - Open SQL Optimizer
 */

class SqlOptimizer {

    optimize(plan) {
        if (!plan) return plan;

        switch (plan.type) {
            case "FILTER":
                return this._optimizeFilter(plan);

            case "JOIN":
                return this._optimizeJoin(plan);

            default:
                return plan;
        }
    }

    /* =====================================================
     * FILTER OPTIMIZATION (Predicate Pushdown)
     * ===================================================== */

    _optimizeFilter(plan) {
        const src = plan.source;

        // FILTER over FILTER → merge
        if (src.type === "FILTER") {
            return {
                type: "FILTER",
                source: src.source,
                condition: {
                    type: "BINARY",
                    operator: "AND",
                    left: src.condition,
                    right: plan.condition
                }
            };
        }

        // FILTER over JOIN → push to left (simple case)
        if (src.type === "JOIN") {
            src.left = {
                type: "FILTER",
                source: src.left,
                condition: plan.condition
            };
            return src;
        }

        return plan;
    }

    /* =====================================================
     * JOIN OPTIMIZATION (placeholder)
     * ===================================================== */

    _optimizeJoin(plan) {
        // Future:
        // - reorder joins
        // - choose join strategies
        return plan;
    }
}

module.exports = SqlOptimizer;
