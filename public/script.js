document.addEventListener("DOMContentLoaded", function () {
    let reactionForm = document.getElementById("reaction-form");

    reactionForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        alert("Sending reaction...");

        let postLink = document.getElementById("post-link").value;
        let reactionType = document.getElementById("reaction-type").value;

        // Get stored cookie from localStorage or sessionStorage
        let cookie = localStorage.getItem("fb_cookie");

        if (!cookie) {
            alert("Error: You must log in to Facebook first.");
            return;
        }

        try {
            let response = await fetch(`/api/react?link=${encodeURIComponent(postLink)}&type=${reactionType}&cookie=${encodeURIComponent(cookie)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            let result = await response.json();
            console.log("API Response:", result);

            if (result.success) {
                alert("Reaction sent successfully!");
            } else {
                alert("Error: " + (result.error || "Reaction failed"));
            }
        } catch (error) {
            alert("Server error. Try again later.");
            console.error("Fetch error:", error);
        }
    });
});
