import React, { useEffect, useRef, useState, useCallback } from "react";
import { getWeather } from "./api.js";
import WeatherPopup from "./components/weatherPopUps.jsx";
import { Map as MapLibreMap, NavigationControl, GeolocateControl, Marker } from "maplibre-gl";
import "./App.css";

function App() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const selectedCoordsRef = useRef(null);

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleClose = useCallback(() => {
    setWeatherData(null);
    setLoading(false);
    setError(null);
    setSelectedCoords(null);
    selectedCoordsRef.current = null;
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [78.9629, 20.5937], // Center on India
      zoom: 4,
      attributionControl: true,
    });

    map.addControl(new NavigationControl(), "top-right");
    map.addControl(
      new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      })
    );

    mapRef.current = map;

    // Keep popup synced with geographic coordinates when zooming/panning
    const syncPopupWithMap = () => {
      if (selectedCoordsRef.current && mapRef.current) {
        const point = mapRef.current.project([
          selectedCoordsRef.current.lon,
          selectedCoordsRef.current.lat,
        ]);
        setPopupPosition({ x: point.x, y: point.y });
      }
    };

    map.on("move", syncPopupWithMap);
    map.on("zoom", syncPopupWithMap);

    map.on("click", async (e) => {
      // Normalize longitude to [-180, 180] in case user panned across world copies
      const wrapped = e.lngLat.wrap();
      const lat = Math.max(-90, Math.min(90, wrapped.lat));
      const lon = Math.max(-180, Math.min(180, wrapped.lng));

      selectedCoordsRef.current = { lat, lon };
      setSelectedCoords({ lat, lon });

      // Update screen position for popup
      const point = map.project([lon, lat]);
      setPopupPosition({ x: point.x, y: point.y });

      // Place or reposition marker
      if (markerRef.current) {
        markerRef.current.setLngLat([lon, lat]);
      } else {
        markerRef.current = new Marker({ color: "#38bdf8" })
          .setLngLat([lon, lat])
          .addTo(map);
      }

      setLoading(true);
      setError(null);
      setWeatherData(null);

      try {
        const weather = await getWeather({ lat, lon });
        setWeatherData(weather);
      } catch (err) {
        console.error("Failed to get weather:", err);
        setError(err.message || "Failed to retrieve weather data.");
      } finally {
        setLoading(false);
      }
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div>
      {/* Floating Header */}
      <div className="app-header">
        <span className="app-header__icon">🌍</span>
        <div>
          <h1 className="app-header__title">Live Weather Map</h1>
          <p className="app-header__hint">Click anywhere on the globe to inspect real-time weather</p>
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height: "100vh", width: "100vw" }} />

      {/* Responsive Glassmorphism Weather Card */}
      <WeatherPopup
        data={weatherData}
        loading={loading}
        error={error}
        position={popupPosition}
        coordinates={selectedCoords}
        onClose={handleClose}
      />
    </div>
  );
}

export default App;