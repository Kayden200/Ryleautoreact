document.addEventListener("DOMContentLoaded", function () {
    let loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        alert("Logging in...");

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let termsAccepted = document.getElementById("terms").checked;

        if (!termsAccepted) {
            alert("You must agree to the Terms and Conditions.");
            return;
        }

        try {
            let response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            let result = await response.json();
            if (response.ok) {
                alert("Login successful! Redirecting...");
                console.log("Response:", result);
                window.location.href = "/dashboard";
            } else {
                alert("Login failed: " + (result.error || "Unknown error"));
                console.log("Error Response:", result);
            }
        } catch (error) {
            alert("Server error. Try again later.");
            console.error("Fetch error:", error);
        }
    });
});
