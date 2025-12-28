"use strict";

/**
 * CTS Transport Queue
 * -------------------
 * Manages transport queues per target system
 *
 * SAP equivalent:
 * - Import Queue (STMS)
 */

class TransportQueue {

    constructor() {
        // systemId -> [trId]
        this.queues = Object.create(null);
    }

    enqueue(systemId, trId) {
        if (!this.queues[systemId]) {
            this.queues[systemId] = [];
        }
        this.queues[systemId].push(trId);
    }

    dequeue(systemId) {
        return this.queues[systemId]?.shift() || null;
    }

    list(systemId) {
        return this.queues[systemId] || [];
    }
}

module.exports = TransportQueue;
