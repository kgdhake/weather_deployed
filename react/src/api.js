const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';


export const getWeather = async ({ lat, lon }) => {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon)
    });

    const response = await fetch(`${API_BASE_URL}/weather?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Weather request failed (${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};