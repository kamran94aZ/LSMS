"use strict";

/**
 * Debug Server
 * ------------
 * WebSocket server for remote debugging
 */

const WebSocket = require("ws");

class DebugServer {

    constructor(debugManager) {
        this.wss = new WebSocket.Server({ port: 9229 });
        this.debugManager = debugManager;
        this._init();
    }

    _init() {
        this.wss.on("connection", ws => {
            ws.on("message", msg => {
                const cmd = JSON.parse(msg);

                if (cmd.action === "resume") {
                    this.debugManager.stepController.resume(cmd.runtime);
                }
            });
        });
    }
}

module.exports = DebugServer;
