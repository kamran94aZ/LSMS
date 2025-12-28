"use strict";

/**
 * Cluster Leader Election
 * -----------------------
 * Elects a master node
 */

class LeaderElection {

    constructor(nodeId) {
        this.nodeId = nodeId;
        this.leaderId = null;
    }

    elect(peers) {
        // Simple deterministic election (lowest ID wins)
        this.leaderId = [this.nodeId, ...peers].sort()[0];
        return this.leaderId;
    }

    isLeader() {
        return this.leaderId === this.nodeId;
    }
}

module.exports = LeaderElection;
