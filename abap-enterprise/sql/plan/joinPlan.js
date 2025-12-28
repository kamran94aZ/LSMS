"use strict";

/**
 * SQL Filter Plan
 * ---------------
 * Represents WHERE condition in execution plan
 *
 * SAP equivalent:
 * - Filter operator
 */

class FilterPlan {

    constructor(sourcePlan, condition) {
        this.type = "FILTER";
        this.source = sourcePlan;
        this.condition = condition;
    }

    toString() {
        return `FILTER(${this.source.toString?.() || this.source.type})`;
    }
}

module.exports = FilterPlan;
