"use strict";

/**
 * SQL Plan Builder
 * ----------------
 * Builds logical execution plans from Open SQL
 *
 * SAP equivalent:
 * - Query Plan Generator
 */

const FilterPlan = require("./filterPlan");
const JoinPlan = require("./joinPlan");

class PlanBuilder {

    build(sql) {

        let plan = {
            type: "SCAN",
            table: sql.table
        };

        // WHERE
        if (sql.where) {
            plan = new FilterPlan(plan, sql.where);
        }

        // JOIN (future)
        if (sql.joins && sql.joins.length) {
            for (const join of sql.joins) {
                plan = new JoinPlan(plan, join);
            }
        }

        return plan;
    }
}

module.exports = PlanBuilder;
