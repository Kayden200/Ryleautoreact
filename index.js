const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/react', async (req, res) => {
    const { link, type, cookie } = req.query;

    if (!link || !type || !cookie) {
        return res.status(400).json({ error: "Missing required parameters: link, type, or cookie." });
    }

    try {
        const response = await axios.post("https://flikers.net/android/android_get_react.php", 
            {
                post_id: link,
                react_type: type,
                version: "v1.7"
            }, 
            {
                headers: {
                    'User-Agent': "Dalvik/2.1.0 (Linux; U; Android 12; V2134 Build/SP1A.210812.003)",
                    'Connection': "Keep-Alive",
                    'Accept-Encoding': "gzip",
                    'Content-Type': "application/json",
                    'Cookie': cookie
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            details: error.response ? error.response.data : "No response from server"
        });
    }
});

const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
