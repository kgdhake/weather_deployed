import React from "react";
import "./weatherPopup.css";

const WeatherPopup = ({ data, loading, error, position, coordinates, onClose }) => {
  if (!data && !loading && !error) return null;

  const popupWidth = 290;
  const popupHeight = 240;
  const winWidth = typeof window !== "undefined" ? window.innerWidth : 800;
  const winHeight = typeof window !== "undefined" ? window.innerHeight : 600;

  const left = Math.max(12, Math.min(position.x + 15, winWidth - popupWidth - 12));
  const top = Math.max(12, Math.min(position.y + 15, winHeight - popupHeight - 12));

  // Loading State
  if (loading) {
    return (
      <div
        className="weather-popup weather-popup--loading"
        style={{ left, top }}
      >
        <button className="weather-popup__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="weather-popup__spinner-container">
          <div className="weather-popup__spinner" />
          <p className="weather-popup__loading-text">Fetching weather data...</p>
          {coordinates && (
            <span className="weather-popup__coords">
              {coordinates.lat.toFixed(3)}°, {coordinates.lon.toFixed(3)}°
            </span>
          )}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className="weather-popup weather-popup--error"
        style={{ left, top }}
      >
        <button className="weather-popup__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="weather-popup__error-container">
          <span className="weather-popup__error-icon">⚠️</span>
          <h4 className="weather-popup__error-title">Unable to Load Weather</h4>
          <p className="weather-popup__error-msg">{error}</p>
          {coordinates && (
            <span className="weather-popup__coords">
              {coordinates.lat.toFixed(3)}°, {coordinates.lon.toFixed(3)}°
            </span>
          )}
        </div>
      </div>
    );
  }

  const weatherMain = data?.weather?.[0]?.main ?? "N/A";
  const weatherDesc = data?.weather?.[0]?.description ?? "";
  const iconCode = data?.weather?.[0]?.icon;
  const iconUrl = iconCode && /^[0-9]{2}[dn]$/.test(String(iconCode))
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;

  const locationName = data?.name
    ? (data?.sys?.country ? `${data.name}, ${data.sys.country}` : data.name)
    : coordinates
    ? `${coordinates.lat.toFixed(2)}°, ${coordinates.lon.toFixed(2)}°`
    : "Unknown Location";

  const temp = data?.main?.temp != null ? `${Math.round(data.main.temp)}°C` : "N/A";
  const feelsLike = data?.main?.feels_like != null ? `${Math.round(data.main.feels_like)}°C` : "N/A";
  const humidity = data?.main?.humidity != null ? `${data.main.humidity}%` : "N/A";
  const windSpeed = data?.wind?.speed != null ? `${data.wind.speed} m/s` : "N/A";

  return (
    <div
      className="weather-popup"
      style={{ left, top }}
    >
      {/* Close button */}
      <button className="weather-popup__close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {/* Header with icon & city */}
      <div className="weather-popup__header">
        {iconUrl ? (
          <img
            className="weather-popup__icon"
            src={iconUrl}
            alt={weatherDesc}
          />
        ) : (
          <div className="weather-popup__icon-fallback">⛅</div>
        )}
        <div className="weather-popup__header-text">
          <h3 className="weather-popup__city" title={locationName}>
            {locationName}
          </h3>
          <span className="weather-popup__desc">
            {weatherDesc || weatherMain}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="weather-popup__divider" />

      {/* Stats grid */}
      <div className="weather-popup__stats">
        <div className="weather-popup__stat">
          <span className="weather-popup__stat-icon">🌡️</span>
          <div>
            <span className="weather-popup__stat-value">{temp}</span>
            <span className="weather-popup__stat-label">Temperature</span>
          </div>
        </div>

        <div className="weather-popup__stat">
          <span className="weather-popup__stat-icon">🤗</span>
          <div>
            <span className="weather-popup__stat-value">{feelsLike}</span>
            <span className="weather-popup__stat-label">Feels Like</span>
          </div>
        </div>

        <div className="weather-popup__stat">
          <span className="weather-popup__stat-icon">💧</span>
          <div>
            <span className="weather-popup__stat-value">{humidity}</span>
            <span className="weather-popup__stat-label">Humidity</span>
          </div>
        </div>

        <div className="weather-popup__stat">
          <span className="weather-popup__stat-icon">💨</span>
          <div>
            <span className="weather-popup__stat-value">{windSpeed}</span>
            <span className="weather-popup__stat-label">Wind</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPopup;
