document.addEventListener("DOMContentLoaded", () => {

    const table = document.querySelector("table");
    if (!table) {
        console.error("Statistics table not found!");
        return;
    }

    const tbody = table.querySelector("tbody");
    if (!tbody) {
        console.error("Table body not found!");
        return;
    }

    function recalculateTotals() {
        const rows = tbody.querySelectorAll("tr");

        if (rows.length < 2) {
            console.warn("Not enough rows to calculate totals.");
            return;
        }

        const totalRow = rows[rows.length - 1];

        let totalPositive = 0;
        let totalNegative = 0;
        let totalAccount = 0;

        // Loop through all rows except the last (Total)
        for (let i = 0; i < rows.length - 1; i++) {
            const cells = rows[i].querySelectorAll("td");

            if (cells.length < 4) continue;

            const positive = parseFloat(cells[1].innerText) || 0;
            const negative = parseFloat(cells[2].innerText) || 0;
            const account = parseFloat(cells[3].innerText) || 0;

            totalPositive += positive;
            totalNegative += negative;
            totalAccount += account;
        }

        // Write totals into the last row
        const totalCells = totalRow.querySelectorAll("td");
        if (totalCells.length >= 4) {
            totalCells[1].innerHTML = `<strong>${totalPositive}</strong>`;
            totalCells[2].innerHTML = `<strong>${totalNegative}</strong>`;
            totalCells[3].innerHTML = `<strong>${totalAccount}</strong>`;
        }
    }

    // Initial calculation
    recalculateTotals();

    // Automatically update totals when the table changes
    const observer = new MutationObserver(() => {
        recalculateTotals();
    });

    observer.observe(tbody, {
        childList: true,
        subtree: true,
        characterData: true
    });

});

