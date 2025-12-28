"use strict";

/**
 * Step Controller
 * ---------------
 * Controls step into / over / out
 */

class StepController {

    constructor() {
        this.mode = null; // INTO | OVER | OUT
        this.depth = 0;
    }

    stepInto() {
        this.mode = "INTO";
    }

    stepOver(currentDepth) {
        this.mode = "OVER";
        this.depth = currentDepth;
    }

    stepOut(currentDepth) {
        this.mode = "OUT";
        this.depth = currentDepth;
    }

    shouldPause(currentDepth = 0) {
        if (!this.mode) return false;

        if (this.mode === "INTO") return true;
        if (this.mode === "OVER") return currentDepth <= this.depth;
        if (this.mode === "OUT") return currentDepth < this.depth;

        return false;
    }

    async pause(runtime, node) {
        // Block execution until debugger resumes
        return new Promise(resolve => {
            runtime.__resume = resolve;
        });
    }

    resume(runtime) {
        if (runtime.__resume) {
            runtime.__resume();
            runtime.__resume = null;
            this.mode = null;
        }
    }
}

module.exports = StepController;
