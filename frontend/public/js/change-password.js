document.getElementById("changeBtn").addEventListener("click", async () => {
    const password = document.getElementById("newPassword").value;
    const errorBox = document.getElementById("passwordError");

    const rules = [
        { regex: /.{12,}/, message: "Minimum 12 characters required." },
        { regex: /[A-Z]/, message: "At least one uppercase letter required." },
        { regex: /[a-z]/, message: "At least one lowercase letter required." },
        { regex: /[0-9]/, message: "At least one digit required." },
        { regex: /[^A-Za-z0-9]/, message: "At least one symbol required." }
    ];

    for (let rule of rules) {
        if (!rule.regex.test(password)) {
            errorBox.innerText = rule.message;
            errorBox.className = "error";
            return;
        }
    }

    errorBox.innerText = "Strong password ✔";
    errorBox.className = "success";

    const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: password })
    });

    if (!res.ok) {
        errorBox.innerText = "Password change failed.";
        errorBox.className = "error";
        return;
    }

    window.location.href = "/public/admin.html";
});
