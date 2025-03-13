// Load Environment Variables
require("dotenv").config();

// Import Dependencies
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // Required for Google Maps API

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sanam!!5",  // Your MySQL password
    database: "business_directory"
});

db.connect(err => {
    if (err) {
        console.log("❌ Database connection failed:", err);
    } else {
        console.log("✅ Database connected successfully");
    }
});

// Middleware to Verify JWT Token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token.split(" ")[1], "your_secret_key");
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
};

// ✅ Google Maps API Key (Replace with your actual key)
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace this with your actual key

// 🔹 User Registration
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const checkUser = "SELECT * FROM users WHERE email = ?";
    db.query(checkUser, [email], (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Insert new user into the database
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, password], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Registration failed" });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    });
});

// 🔹 User Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err || result.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = result[0];

        // Plain-text password comparison
        if (password !== user.password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    });
});

// 🔹 Add a New Business (With Location Fetching)
app.post("/businesses", authenticateToken, async (req, res) => {
    const { name, description, category, location, image_url, website, operating_hours, facebook, instagram, twitter } = req.body;
    const owner_id = req.user.id; // Get logged-in user ID from JWT token

    let latitude = null;
    let longitude = null;

    // Fetch latitude & longitude from Google Maps API
    if (location) {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address: location,
                    key: GOOGLE_MAPS_API_KEY,
                },
            });

            if (response.data.status === "OK") {
                latitude = response.data.results[0].geometry.location.lat;
                longitude = response.data.results[0].geometry.location.lng;
                console.log(`✅ Coordinates Found: ${latitude}, ${longitude}`);
            } else {
                console.error("❌ Failed to get coordinates:", response.data.status);
            }
        } catch (error) {
            console.error("❌ Error fetching coordinates:", error);
            return res.status(500).json({ error: "Failed to fetch coordinates" });
        }
    }

    // Insert into database
    const sql = `
        INSERT INTO businesses 
        (name, description, category, location, image_url, website, operating_hours, facebook, instagram, twitter, latitude, longitude, owner_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, description, category, location, image_url, website, operating_hours, facebook, instagram, twitter, latitude, longitude, owner_id], (err, result) => {
        if (err) {
            console.error("❌ Database insert error:", err);
            return res.status(500).json({ error: "Failed to add business" });
        }
        res.status(201).json({ message: "Business added successfully!", latitude, longitude });
    });
});

// 🔹 Get All Businesses
app.get("/businesses", (req, res) => {
    const sql = "SELECT * FROM businesses";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve businesses" });
        }
        res.json(result);
    });
});

// 🔹 Edit a Business
app.put("/businesses/:id", authenticateToken, (req, res) => {
    const businessId = req.params.id;
    const { name, description, category, location, image_url } = req.body;
    const owner_id = req.user.id;

    const sql = "UPDATE businesses SET name = ?, description = ?, category = ?, location = ?, image_url = ? WHERE id = ? AND owner_id = ?";
    db.query(sql, [name, description, category, location, image_url, businessId, owner_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update business" });
        }
        res.status(200).json({ message: "Business updated successfully!" });
    });
});

// 🔹 Delete a Business
app.delete("/businesses/:id", authenticateToken, (req, res) => {
    const businessId = req.params.id;
    const owner_id = req.user.id;

    const sql = "DELETE FROM businesses WHERE id = ? AND owner_id = ?";
    db.query(sql, [businessId, owner_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete business" });
        }
        res.status(200).json({ message: "Business deleted successfully!" });
    });
});

// 🔹 Start the Server
app.get("/", (req, res) => {
    res.send("✅ Backend is working!");
});
app.get("/businesses/:id", (req, res) => {
    const businessId = req.params.id;
    const sql = "SELECT * FROM businesses WHERE id = ?";
    db.query(sql, [businessId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve business" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Business not found" });
        }
        res.status(200).json(result[0]);
    });
});

app.put("/businesses/:id/upgrade", authenticateToken, (req, res) => {
    const businessId = req.params.id;
    const owner_id = req.user.id;

    const sql = "UPDATE businesses SET premium = TRUE WHERE id = ? AND owner_id = ?";
    db.query(sql, [businessId, owner_id], (err, result) => {
        if (err) return res.status(500).json({ error: "❌ Failed to upgrade business." });

        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "❌ Unauthorized or business not found." });
        }

        res.status(200).json({ message: "🚀 Business upgraded to premium!" });
    });
});






app.listen(5000, () => console.log("🚀 Server running on port 5000"));
