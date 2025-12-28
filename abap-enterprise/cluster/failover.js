"use strict";

/**
 * Failover Manager
 * ----------------
 * Detects node failure and triggers re-election
 */

class FailoverManager {

    constructor(discovery, leader) {
        this.discovery = discovery;
        this.leader = leader;
    }

    nodeDown(nodeId) {
        const peers = this.discovery.getPeers().filter(p => p !== nodeId);
        return this.leader.elect(peers);
    }
}

module.exports = FailoverManager;
