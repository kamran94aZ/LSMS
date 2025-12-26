const WebSocket = require("ws");

let wss;


function initWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on("connection", ws => {
        console.log("WebSocket client connected");

        ws.on("close", () => {
            console.log("WebSocket client disconnected");
        });
    });
}


function broadcastLog(log) {
    if (!wss) return;

    const data = JSON.stringify(log);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

module.exports = {
    initWebSocket,
    broadcastLog
};
