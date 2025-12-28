"use strict";

/**
 * Call Stack Engine
 * -----------------
 * Tracks runtime call stack
 */

class CallStack {

    constructor() {
        this.frames = [];
    }

    sync(runtimeStack) {
        this.frames = runtimeStack.map(f => ({
            type: f.type,
            name: f.method || f.name || f.class
        }));
    }

    get() {
        return this.frames;
    }
}

module.exports = CallStack;
