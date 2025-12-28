"use strict";

/**
 * Debug Manager
 * -------------
 * Central debugger orchestrator
 *
 * SAP equivalent:
 * - Debugger Kernel
 */

const BreakpointEngine = require("./breakpointEngine");
const StepController = require("./stepController");
const CallStack = require("./callStack");

class DebugManager {

    constructor() {
        this.breakpoints = new BreakpointEngine();
        this.stepController = new StepController();
        this.callStack = new CallStack();
        this.sessions = new Map();
    }

    /* =====================================================
     * SESSION MANAGEMENT
     * ===================================================== */

    startSession(runtime) {
        const sessionId = Date.now().toString();
        this.sessions.set(sessionId, {
            runtime,
            watches: [],
            active: true
        });
        runtime.debugSessionId = sessionId;
        return sessionId;
    }

    endSession(runtime) {
        this.sessions.delete(runtime.debugSessionId);
        runtime.debugSessionId = null;
    }

    /* =====================================================
     * EXECUTION HOOK
     * ===================================================== */

    async onBeforeExecute(node, runtime) {
        const session = this.sessions.get(runtime.debugSessionId);
        if (!session) return;

        // Call stack tracking
        this.callStack.sync(runtime.callStack);

        // Breakpoint check
        if (
            this.breakpoints.hit(node, runtime) ||
            this.stepController.shouldPause()
        ) {
            await this.stepController.pause(runtime, node);
        }
    }
}

module.exports = new DebugManager();
