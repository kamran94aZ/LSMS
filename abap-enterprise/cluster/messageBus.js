"use strict";

/**
 * Message Bus
 * -----------
 * Replicates messages between nodes
 */

const EventEmitter = require("events");

class MessageBus extends EventEmitter {

    broadcast(event, payload) {
        this.emit(event, payload);
    }

    subscribe(event, handler) {
        this.on(event, handler);
    }
}

module.exports = MessageBus;
