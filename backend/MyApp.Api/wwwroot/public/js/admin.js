// ===============================
// AUTH CHECK
// ===============================
(async () => {
    try {
        const res = await fetch("/api/admin/tests/ping", {
            credentials: "include"
        });

        if (res.status === 401) {
            location.href = "/public/login.html";
            return;
        }

        if (res.status === 403) {
            location.href = "/public/change-password.html";
            return;
        }
    } catch {
        location.href = "/public/login.html";
    }
})();

// ===============================
// STATE (ONLY FROM BACKEND)
// ===============================
let categories = [];
let tests = [];

// ===============================
// PAGE SWITCHER
// ===============================
window.loadPage = function (id) {
    document.querySelectorAll(".page").forEach(p => p.hidden = true);

    const page = document.getElementById(id);
    if (!page) return;

    page.hidden = false;

    if (id === "categories") loadCategories();
    if (id === "tests") loadTests();
};

// ===============================
// API HELPERS
// ===============================
async function apiGet(url) {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(res.status);
    return res.json();
}

async function apiPost(url, body) {
    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(res.status);
}

async function apiDelete(url) {
    const res = await fetch(url, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) throw new Error(res.status);
}

// ===============================
// CATEGORIES
// ===============================
async function loadCategories() {
    categories = await apiGet("/api/admin/categories");
    renderCategories();
}

async function addCategory() {
    const input = document.getElementById("catName");
    if (!input.value.trim()) return;

    await apiPost("/api/admin/categories", {
        name: input.value.trim()
    });

    input.value = "";
    await loadCategories();
}

function renderCategories() {
    const table = document.getElementById("categoryTable");
    const select = document.getElementById("testCategory");

    table.innerHTML = "<tr><th>ID</th><th>Name</th></tr>";

    categories.forEach(c => {
        table.innerHTML += `<tr><td>${c.id}</td><td>${c.name}</td></tr>`;
    });

    select.innerHTML = categories
        .map(c => `<option value="${c.id}">${c.name}</option>`)
        .join("");

    updateStats();
}

// ===============================
// TESTS
// ===============================
async function loadTests() {
    tests = await apiGet("/api/admin/tests");
    renderTests();
}

async function addTest() {
    const nameInput = document.getElementById("testName");
    const catSelect = document.getElementById("testCategory");

    if (!nameInput.value.trim()) return;

    await apiPost("/api/admin/tests", {
        name: nameInput.value.trim(),
        categoryId: Number(catSelect.value)
    });

    nameInput.value = "";
    await loadTests();
}

async function deleteTest(id) {
    await apiDelete(`/api/admin/tests/${id}`);
    await loadTests();
}

function renderTests() {
    const table = document.getElementById("testTable");

    table.innerHTML =
        "<tr><th>ID</th><th>Name</th><th>Category</th><th></th></tr>";

    tests.forEach(t => {
        const cat = categories.find(c => c.id === t.categoryId)?.name || "";
        table.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.name}</td>
                <td>${cat}</td>
                <td>
                    <button onclick="deleteTest(${t.id})">Delete</button>
                </td>
            </tr>`;
    });

    updateStats();
}

// ===============================
// DASHBOARD
// ===============================
function updateStats() {
    document.getElementById("statCat").innerText = categories.length;
    document.getElementById("statTest").innerText = tests.length;
}

// ===============================
// LOGOUT (SAFE, REAL LOGOUT)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            sessionStorage.clear();
            localStorage.clear();

            window.location.href = "/public/login.html";
        } catch (err) {
            console.error("Logout failed", err);
            window.location.href = "/public/login.html";
        }
    });
});


// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
    await loadCategories();
    await loadTests();
    loadPage("dashboard");
});
