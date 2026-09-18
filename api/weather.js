export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "WEATHER_API_KEY not configured on Vercel" });
  }

  if (lat === undefined || lon === undefined || lat === null || lon === null) {
    return res.status(400).json({ error: "Latitude and longitude are required query parameters" });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

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
    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      appid: apiKey,
      units: "metric"
    });

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`,
      {
        signal: AbortSignal.timeout(15000)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenWeather API error response:", data);
      return res.status(response.status).json({
        error: "Failed to retrieve weather data from provider."
      });
    }

    // Cache responses at the edge for 10 minutes to reduce API usage and improve performance
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Weather endpoint error:", error.message);
    return res.status(502).json({
      error: "Failed to retrieve weather data from provider. Please try again later."
    });
  }
}
