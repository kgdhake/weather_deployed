import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Weather API key not configured on server" });
  }

  if (lat === undefined || lon === undefined || lat === null || lon === null) {
    return res.status(400).json({ error: "Latitude and longitude are required query parameters" });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  // Validate that latitude and longitude are valid numbers within realistic geo ranges
  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({
      error: "Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180."
    });
  }

  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat: latitude,
        lon: longitude,
        appid: apiKey,
        units: "metric"
      },
      timeout: 15000 // 15 second timeout to handle high-latency connections safely
    });

    res.json(response.data);
  } catch (error) {
    // Log details internally for debugging without exposing secrets or stack traces to client
    console.error("Weather API upstream error:", error.response?.status, error.response?.data?.message || error.message);

    const clientStatus = error.response?.status && error.response.status >= 400 && error.response.status < 500
      ? error.response.status
      : 502;

    res.status(clientStatus).json({
      error: "Failed to retrieve weather data from provider. Please try again later."
    });
  }
});

export default router;

