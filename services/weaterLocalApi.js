import { mockWeatherData } from "../data/mockWeather";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Définit si l'application doit utiliser les données locales ou l'API réelle.
 * Utile pour les tests, les démos sans Wi-Fi ou pour économiser le quota API.
 */
const USE_MOCK = false; 

export const fetchWeather = async (city) => {
  // --- MODE MOCK (Données locales) ---
  if (USE_MOCK) {
    console.log(`[Mock] Recherche locale pour : ${city}`);
    
    // Simule un délai réseau de 500ms
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Recherche insensible à la casse (Paris ou paris)
    const cityName = Object.keys(mockWeatherData).find(
      (key) => key.toLowerCase() === city.toLowerCase()
    );

    return mockWeatherData[cityName] || null;
  }

  
  // --- MODE RÉEL (Appel API OpenWeather) ---
  try {
    if (!city) return null;

    const response = await fetch(
      `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}&lang=fr`
    );

    if (!response.ok) {
      // Si la ville n'existe pas (404) ou autre erreur
      throw new Error("Ville non trouvée ou erreur API");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Erreur lors de la récupération météo :", error);
    return null;
  }
};