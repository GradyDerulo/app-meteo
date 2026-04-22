const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeather = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}&lang=fr`);
    if (!response.ok) throw new Error("Ville non trouvée");
    return await response.json();
  } catch (error) {
    console.error("Erreur API Météo:", error);
    return null;
  }
};