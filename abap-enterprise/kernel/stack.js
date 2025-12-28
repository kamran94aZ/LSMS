"use strict";

/**
 * ABAP Enterprise Kernel – Call Stack Manager
 * ------------------------------------------
 * Responsible for:
 * - FORM / METHOD / FUNCTION call stack
 * - Nested execution contexts
 * - Recursion support
 * - Debugger stack trace
 *
 * SAP equivalent:
 * - Roll Area
 * - Internal Session Stack
 */

class CallStack {

    constructor() {
        this.frames = [];
    }

    /**
     * Push new stack frame
     * @param {String} type - FORM | METHOD | FUNCTION | EVENT
     * @param {String} name - Name of routine
     */
    push(type, name) {
        this.frames.push({
            type,
            name,
            locals: Object.create(null),
            createdAt: Date.now()
        });
    }

    /**
     * Pop current stack frame
     */
    pop() {
        if (this.frames.length === 0) {
            throw new Error("Call stack underflow");
        }
        return this.frames.pop();
    }

    /**
     * Get current frame
     */
    current() {
        return this.frames[this.frames.length - 1] || null;
    }

    /**
     * Set variable in current frame
     */
    set(name, value) {
        const frame = this.current();
        if (!frame) {
            throw new Error("No active stack frame");
        }
        frame.locals[name] = value;
    }

    /**
     * Resolve variable (search from top to bottom)
     */
    get(name) {
        for (let i = this.frames.length - 1; i >= 0; i--) {
            if (name in this.frames[i].locals) {
                return this.frames[i].locals[name];
            }
        }
        return undefined;
    }

    /**
     * Check if variable exists in any frame
     */
    has(name) {
        return this.get(name) !== undefined;
    }

    /**
     * Clear entire call stack
     */
    clear() {
        this.frames = [];
    }

    /**
     * Get stack trace (for debugger / error handling)
     */
    trace() {
        return this.frames.map((f, idx) => ({
            level: idx,
            type: f.type,
            name: f.name,
            locals: Object.keys(f.locals)
        }));
    }
}

module.exports = CallStack;
