"use strict";

/**
 * Cluster Controller
 * ------------------
 * Boots and controls cluster lifecycle
 */

const LeaderElection = require("./leader");
const Discovery = require("./discovery");
const MessageBus = require("./messageBus");
const WPManager = require("./wpManager");
const FailoverManager = require("./failover");
const TransactionReplicator = require("./transactionReplicator");

class ClusterController {

    constructor(nodeId) {
        this.nodeId = nodeId;

        this.discovery = new Discovery(nodeId);
        this.leaderElection = new LeaderElection(nodeId);
        this.bus = new MessageBus();
        this.wpManager = new WPManager();
        this.failover = new FailoverManager(this.discovery, this.leaderElection);
        this.txReplicator = new TransactionReplicator(this.bus);
    }

    start() {
        this.wpManager.register(this.nodeId);

        this.discovery.on("peer", () => {
            const leader = this.leaderElection.elect(
                this.discovery.getPeers()
            );
            console.log("Leader elected:", leader);
        });
    }
}

module.exports = ClusterController;
