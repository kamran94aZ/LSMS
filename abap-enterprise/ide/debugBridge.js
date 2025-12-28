"use strict";

/**
 * IDE Debug Bridge
 * ----------------
 * Connects IDE actions to debugger
 */

class DebugBridge {

    constructor(debugManager) {
        this.debugManager = debugManager;
    }

    addBreakpoint(bp) {
        this.debugManager.breakpoints.add(bp);
    }

    removeBreakpoint(bp) {
        this.debugManager.breakpoints.remove(bp);
    }

    stepInto() {
        this.debugManager.stepController.stepInto();
    }

    stepOver(depth) {
        this.debugManager.stepController.stepOver(depth);
    }

    stepOut(depth) {
        this.debugManager.stepController.stepOut(depth);
    }

    resume(runtime) {
        this.debugManager.stepController.resume(runtime);
    }
}

module.exports = DebugBridge;
