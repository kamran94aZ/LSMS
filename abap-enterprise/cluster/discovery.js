"use strict";

/**
 * Node Discovery
 * --------------
 * Discovers cluster peers
 */

const EventEmitter = require("events");

class Discovery extends EventEmitter {

    constructor(nodeId) {
        super();
        this.nodeId = nodeId;
        this.peers = new Set();
    }

    announce(peerId) {
        if (peerId !== this.nodeId) {
            this.peers.add(peerId);
            this.emit("peer", peerId);
        }
    }

    getPeers() {
        return Array.from(this.peers);
    }
}

module.exports = Discovery;
