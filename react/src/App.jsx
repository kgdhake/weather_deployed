import React, { useEffect, useRef, useState } from "react";
import { getWeather } from "./api.js";
import WeatherPopup from "./components/weatherPopUps.jsx";
import { Map as MapLibreMap, NavigationControl, GeolocateControl } from "maplibre-gl";

function App() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [78.9629, 20.5937], // Center on India
      zoom: 4,
      attributionControl: true,
    });

    map.addControl(new NavigationControl(), "top-right");
    map.addControl(new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }));

    mapRef.current = map;

    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      try {
        const weather = await getWeather({ lat, lon: lng });
        
        // Get pixel position of click for popup placement
        const point = map.project(e.lngLat);
        setWeatherData(weather);
        setPopupPosition({
          x: point.x,
          y: point.y,
        });
      } catch (error) {
        console.error("Failed to get weather:", error);
        alert(error.message);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} style={{ height: "100vh", width: "100vw" }} />
      <WeatherPopup
        data={weatherData}
        position={popupPosition}
        onClose={() => setWeatherData(null)}
      />
    </div>
  );
}

export default App;