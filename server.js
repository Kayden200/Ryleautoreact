const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/api/react", async (req, res) => {
    const { link, type, cookie } = req.query;

    if (!link || !type || !cookie) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        let response = await axios.post("https://flikers.net/android/android_get_react.php", {
            post_id: link,
            react_type: type,
            version: "v1.7"
        }, {
            headers: {
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 12; V2134 Build/SP1A.210812.003)",
                "Connection": "Keep-Alive",
                "Accept-Encoding": "gzip",
                "Content-Type": "application/json",
                "Cookie": cookie
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Reaction API error:", error);
        res.status(500).json({ error: "Failed to send reaction" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
