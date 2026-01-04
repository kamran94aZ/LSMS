document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".login-form");
  const button = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    button.classList.add("clicked");
    setTimeout(() => button.classList.remove("clicked"), 300);

    try {
      const res = await fetch("https://localhost:7172/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch {}

      if (!res.ok) {
        console.error("LOGIN FAILED:", res.status, text);
        alert(`Login failed (${res.status})`);
        return;
      }

      if (data?.mustChangePassword === true) {
        window.location.href = "/Session1/public/change-password.html";
      } else {
        window.location.href = "/Session1/public/admin.html";
      }

    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Server error. Please try again.");
    }
  });
});


