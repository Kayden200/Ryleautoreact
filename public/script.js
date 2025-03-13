document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        this.textContent = "Show";
    }
});

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const agreeTerms = document.getElementById("agreeTerms").checked;

    if (!agreeTerms) {
        alert("You must agree to the Terms and Conditions.");
        return;
    }

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.error) {
        alert("Login failed: " + result.error);
    } else {
        alert("Login successful! Session stored.");
    }
});
