"use strict";

/**
 * Transaction Replicator
 * ----------------------
 * Replicates LUW state across cluster
 */

class TransactionReplicator {

    constructor(messageBus) {
        this.bus = messageBus;
    }

    replicate(txSnapshot) {
        this.bus.broadcast("TX_REPLICATE", txSnapshot);
    }

    onReplica(handler) {
        this.bus.subscribe("TX_REPLICATE", handler);
    }
}

module.exports = TransactionReplicator;
