"use strict";

/**
 * Breakpoint Engine
 * -----------------
 * Handles breakpoint logic
 */

class BreakpointEngine {

    constructor() {
        this.breakpoints = [];
    }

    add(bp) {
        this.breakpoints.push(bp);
    }

    remove(bp) {
        this.breakpoints = this.breakpoints.filter(b => b !== bp);
    }

    hit(node, runtime) {
        return this.breakpoints.some(bp => {
            if (bp.line && bp.line !== node.meta?.line) return false;
            if (bp.condition) {
                return runtime.evaluate(bp.condition);
            }
            return true;
        });
    }
}

module.exports = BreakpointEngine;
