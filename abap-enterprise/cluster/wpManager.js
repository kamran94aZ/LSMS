"use strict";

/**
 * Work Process Manager
 * --------------------
 * Balances load across nodes
 */

class WPManager {

    constructor() {
        this.workers = [];
    }

    register(nodeId) {
        this.workers.push({ nodeId, load: 0 });
    }

    assignTask(task) {
        const wp = this.workers.sort((a, b) => a.load - b.load)[0];
        wp.load++;
        return wp.nodeId;
    }

    release(nodeId) {
        const wp = this.workers.find(w => w.nodeId === nodeId);
        if (wp) wp.load = Math.max(0, wp.load - 1);
    }
}

module.exports = WPManager;
