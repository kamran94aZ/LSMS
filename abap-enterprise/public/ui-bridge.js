async function refreshFromEclipse() {
    const outputDiv = document.getElementById('output-area');
    const statusText = document.getElementById('status-text');
    const statusInd = document.getElementById('status-indicator');

    if (!outputDiv) return;

    statusText.innerText = "Syncing with Eclipse...";
    statusInd.style.backgroundColor = "orange";

    try {
        // Yeni yaratdığımız live-view API-na müraciət
        const response = await fetch('/api/live-view');
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Server xətası");
        }

        const data = await response.json();

        if (data.success) {
            // Nəticələri sətir-sətir göstər
            if (data.output && data.output.length > 0) {
                outputDiv.innerHTML = data.output.map(line => 
                    `<div class="abap-line">${line}</div>`
                ).join('');
            } else {
                outputDiv.innerHTML = `<div class="info-msg">Program executed (No output).</div>`;
            }

            statusText.innerText = "Synchronized";
            statusInd.style.backgroundColor = "#2b7d2b"; // Yaşıl
        } else {
            outputDiv.innerHTML = `<div class="error-msg"><strong>Kernel Error:</strong> ${data.error}</div>`;
            statusText.innerText = "Runtime Error";
            statusInd.style.backgroundColor = "red";
        }
    } catch (err) {
        console.error("Sync Error:", err);
        outputDiv.innerHTML = `<div class="error-msg"><strong>System Error:</strong> ${err.message}</div>`;
        statusText.innerText = "Connection Failed";
        statusInd.style.backgroundColor = "gray";
    }
}
