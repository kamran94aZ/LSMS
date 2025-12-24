// ===============================
// WEBSOCKET CONNECTION
// ===============================
const socket = new WebSocket("ws://localhost:4000");

// ===============================
// DOM
// ===============================
const tableBody = document.getElementById("LogTableBody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let logs = [];

// ===============================
// SOCKET EVENTS
// ===============================
socket.onopen = () => {
    console.log("Connected to audit websocket");
};

socket.onmessage = (event) => {
    const log = JSON.parse(event.data);
    logs.unshift(log);        
    renderLogs(logs);
};

socket.onerror = (err) => {
    console.error("WebSocket error", err);
};

// ===============================
// RENDER TABLE
// ===============================
function renderLogs(data) {
    tableBody.innerHTML = "";

    data.forEach((log, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.entity}</td>
                <td>${log.details}</td>
                <td>${new Date(log.time).toLocaleString()}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

// ===============================
// SEARCH
// ===============================
searchBtn.addEventListener("click", () => {
    const q = searchInput.value.toLowerCase();

    const filtered = logs.filter(l =>
        l.user.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.entity.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
    );

    renderLogs(filtered);
});

