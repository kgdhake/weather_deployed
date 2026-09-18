import React from "react";
import "./weatherPopup.css";

const WeatherPopup = ({ data, position, onClose }) => {
  if (!data) return null;

  const weatherMain = data?.weather?.[0]?.main ?? "N/A";
  const weatherDesc = data?.weather?.[0]?.description ?? "";
  const iconCode = data?.weather?.[0]?.icon;
  const iconUrl = iconCode && /^[0-9]{2}[dn]$/.test(String(iconCode))
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;

  return (
    <div
      className="weather-popup"
      style={{
        left: position.x + 15,
        top: position.y + 15,
      }}
    >
      {/* Close button */}
      <button className="weather-popup__close" onClick={onClose}>
        ×
      </button>

      {/* Header with icon & city */}
      <div className="weather-popup__header">
        {iconUrl && (
          <img
            className="weather-popup__icon"
            src={iconUrl}
            alt={weatherDesc}
          />
        )}
        <div>
          <h3 className="weather-popup__city">
            {data?.name || "Unknown Location"}
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
            <span className="weather-popup__stat-value">
              {data?.main?.temp ?? "N/A"}°C
            </span>
            <span className="weather-popup__stat-label">Temperature</span>
          </div>
        </div>

        <div className="weather-popup__stat">
          <span className="weather-popup__stat-icon">🤗</span>
          <div>
            <span className="weather-popup__stat-value">
              {data?.main?.feels_like ?? "N/A"}°C
            </span>
            <span className="weather-popup__stat-label">Feels Like</span>
          </div>
        </div>

        <div className="weather-popup__stat">
          <span className="weather-popup__stat-icon">💧</span>
          <div>
            <span className="weather-popup__stat-value">
              {data?.main?.humidity ?? "N/A"}%
            </span>
            <span className="weather-popup__stat-label">Humidity</span>
          </div>
        </div>

        <div className="weather-popup__stat">
          <span className="weather-popup__stat-icon">💨</span>
          <div>
            <span className="weather-popup__stat-value">
              {data?.wind?.speed ?? "N/A"} m/s
            </span>
            <span className="weather-popup__stat-label">Wind</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPopup;
