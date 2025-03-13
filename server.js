const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Route for Facebook Login
app.post("/api/login", bodyParser.json(), async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    let driver;
    try {
        console.log(`Attempting login for: ${email}`);

        let options = new chrome.Options();
        options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");

        driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
        await driver.get("https://www.facebook.com/login");

        await driver.findElement(By.id("email")).sendKeys(email);
        await driver.findElement(By.id("pass")).sendKeys(password);
        await driver.findElement(By.name("login")).click();

        await driver.sleep(5000);

        let currentURL = await driver.getCurrentUrl();
        if (currentURL.includes("checkpoint")) {
            console.log("Checkpoint detected!");
            return res.status(403).json({ error: "Facebook checkpoint detected. Use another account." });
        }

        let cookies = await driver.manage().getCookies();
        let cookieString = cookies.map(c => `${c.name}=${c.value}`).join("; ");

        console.log("Login successful!");
        res.json({ message: "Login successful", cookie: cookieString });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error. Try again later." });
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
