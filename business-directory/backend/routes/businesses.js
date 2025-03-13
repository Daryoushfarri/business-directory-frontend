const express = require("express");
const router = express.Router();
const { Business } = require("../models"); // Import the Business model
const axios = require("axios");

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key

// Add a new business
router.post("/add", async (req, res) => {
  try {
    const { name, address, category, website, operating_hours, facebook, instagram, twitter } = req.body;

    let latitude = null;
    let longitude = null;

    // Fetch latitude & longitude from Google Maps API
    if (address) {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.status === "OK") {
        latitude = response.data.results[0].geometry.location.lat;
        longitude = response.data.results[0].geometry.location.lng;
      }
    }

    // Create a new business entry in the database
    const newBusiness = await Business.create({
      name,
      address,
      category,
      website,
      operating_hours,
      facebook,
      instagram,
      twitter,
      latitude,
      longitude,
    });

    res.status(201).json({ message: "Business added successfully", business: newBusiness });
  } catch (error) {
    console.error("Error adding business:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
