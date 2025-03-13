// Debugging: Check if script is loaded
console.log("Script loaded!");

// Wait for DOM to fully load before running scripts
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM is fully loaded!");

    // Get form elements
    let passwordField = document.getElementById("password");
    let showPasswordBtn = document.getElementById("show-password");
    let loginForm = document.getElementById("login-form");
    let errorMessage = document.getElementById("errorMessage");

    // Ensure elements exist before adding event listeners
    if (!passwordField || !showPasswordBtn || !loginForm) {
        console.error("Error: One or more elements not found!");
        return;
    }

    // Show/Hide Password Toggle
    showPasswordBtn.addEventListener("click", function () {
        console.log("Show Password button clicked!");
        if (passwordField.type === "password") {
            passwordField.type = "text";
            this.textContent = "Hide";
        } else {
            passwordField.type = "password";
            this.textContent = "Show";
        }
    });

    // Login Form Submission
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        let email = document.getElementById("email").value;
        let password = passwordField.value;
        let termsAccepted = document.getElementById("terms").checked;

        if (!termsAccepted) {
            errorMessage.textContent = "You must agree to the Terms and Conditions.";
            return;
        }

        errorMessage.textContent = "Logging in...";

        try {
            let response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            let result = await response.json();
            if (response.ok) {
                window.location.href = "/dashboard"; // Redirect on success
            } else {
                errorMessage.textContent = result.error || "Login failed.";
            }
        } catch (error) {
            console.error("Error:", error);
            errorMessage.textContent = "Server error. Try again later.";
        }
    });
});
