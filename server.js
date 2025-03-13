const express = require("express");
const bodyParser = require("body-parser");
const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const app = express();
const path = require("path");

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    let driver;
    try {
        let options = new chrome.Options();
        options.addArguments("--headless", "--disable-blink-features=AutomationControlled");

        driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
        await driver.get("https://www.facebook.com/login");

        await driver.findElement(By.id("email")).sendKeys(email);
        await driver.findElement(By.id("pass")).sendKeys(password);
        await driver.findElement(By.name("login")).click();

        await driver.sleep(5000); // Wait for login process

        let currentURL = await driver.getCurrentUrl();
        if (currentURL.includes("checkpoint")) {
            return res.status(403).json({ error: "Facebook login checkpoint detected. Use another account." });
        }

        let cookies = await driver.manage().getCookies();
        let cookieString = cookies.map(c => `${c.name}=${c.value}`).join("; ");

        res.json({ message: "Login successful", cookie: cookieString });

    } catch (error) {
        res.status(500).json({ error: "Login failed. Try again." });
    } finally {
        if (driver) await driver.quit();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
