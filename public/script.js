// Debugging: Check if script is loading
alert("Script loaded!"); // Shows an alert when script.js loads

document.addEventListener("DOMContentLoaded", function () {
    alert("DOM fully loaded!"); // Shows an alert when the page is ready

    // Get form elements
    let passwordField = document.getElementById("password");
    let showPasswordBtn = document.getElementById("show-password");
    let loginForm = document.getElementById("login-form");
    let errorMessage = document.getElementById("errorMessage");

    // Ensure elements exist before adding event listeners
    if (!passwordField || !showPasswordBtn || !loginForm) {
        alert("Error: One or more elements not found!");
        return;
    }

    // Show/Hide Password Toggle
    showPasswordBtn.addEventListener("click", function () {
        alert("Show Password button clicked!"); // Debugging
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
        alert("Form submitted!"); // Debugging

        let email = document.getElementById("email").value;
        let password = passwordField.value;
        let termsAccepted = document.getElementById("terms").checked;

        if (!termsAccepted) {
            alert("You must agree to the Terms and Conditions.");
            return;
        }

        alert("Logging in...");

        try {
            let response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            let result = await response.json();
            if (response.ok) {
                alert("Login successful! Redirecting...");
                window.location.href = "/dashboard"; // Redirect on success
            } else {
                alert("Login failed: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            alert("Server error. Try again later.");
        }
    });
});
