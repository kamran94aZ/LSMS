const fileModal = document.getElementById("fileModal");
const createModal = document.getElementById("createModal");
const addDocumentBtn = document.getElementById("addDocumentBtn");
const createDocumentBtn = document.getElementById("createDocumentBtn");
const uploadFileBtn = document.getElementById("uploadFileBtn");
const closeButtons = document.querySelectorAll(".closeModal");
const documentTable = document.getElementById("documentTable");
const nextToSurvey = document.getElementById("nextToSurvey");
const docStyle = document.getElementById("docStyle");
const surveySection = document.getElementById("surveySection");
const step1 = document.getElementById("step1");
const loadingSection = document.getElementById("loadingSection");
const surveyQuestionsDiv = document.getElementById("surveyQuestions");
const submitSurvey = document.getElementById("submitSurvey");

addDocumentBtn.onclick = () => fileModal.style.display = "flex";
createDocumentBtn.onclick = () => createModal.style.display = "flex";
closeButtons.forEach(btn => btn.onclick = () => {
    fileModal.style.display = "none";
    createModal.style.display = "none";
});

uploadFileBtn.onclick = () => {
    const file = document.getElementById("fileInput").files[0];
    const title = document.getElementById("fileTitle").value;
    if (!file || !title) return;
    addDocumentToTable(title, "Uploaded", file.type, new Date(), new Date(), URL.createObjectURL(file));
    fileModal.style.display = "none";
};

nextToSurvey.onclick = () => {
    if (docStyle.value === "individual") {
        step1.classList.add("hidden");
        surveySection.classList.remove("hidden");
        generateSurvey();
    } else {
        completeCreation("Similar Template");
    }
};

submitSurvey.onclick = () => {
    surveySection.classList.add("hidden");
    loadingSection.classList.remove("hidden");
    setTimeout(() => completeCreation("Survey-Based"), 3000);
};

function generateSurvey() {
    surveyQuestionsDiv.innerHTML = "";
    for (let i = 1; i <= 15; i++) {
        const q = document.createElement("div");
        q.innerHTML = `
            <label>Question ${i}</label><br>
            <select>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
            </select>
        `;
        surveyQuestionsDiv.appendChild(q);
    }
}

function completeCreation(type) {
    const docType = document.getElementById("docFormat").value;
    const title = "Generated Document " + Math.floor(Math.random() * 9999);
    const link = "https://qms-enterprise-docs/" + Date.now();
    addDocumentToTable(title, "Created", docType, new Date(), new Date(), link);
    loadingSection.classList.add("hidden");
    step1.classList.remove("hidden");
    createModal.style.display = "none";
}

function addDocumentToTable(title, status, type, created, updated, link) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${title}</td>
        <td>${status}</td>
        <td>${type}</td>
        <td>${created.toLocaleString()}</td>
        <td>${updated.toLocaleString()}</td>
        <td><a href="${link}" target="_blank">Open</a></td>
    `;
    documentTable.appendChild(row);
}

(() => {
    const isAuth = sessionStorage.getItem("isAuthenticated");
    if (isAuth !== "true") {
        window.location.href = "/public/login.html";
    }
})();


document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();

    
    sessionStorage.clear();
    localStorage.clear();

    
    window.location.replace("/public/login.html");
});
