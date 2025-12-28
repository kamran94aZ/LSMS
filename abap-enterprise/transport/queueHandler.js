"use strict";

/**
 * Transport Queue Handler
 * -----------------------
 * Handles physical transport queue
 */

class QueueHandler {

    constructor() {
        this.queue = [];
    }

    enqueue(pkg) {
        this.queue.push(pkg);
    }

    dequeue() {
        return this.queue.shift() || null;
    }

    list() {
        return this.queue.map(p => p.trId);
    }
}

module.exports = QueueHandler;
