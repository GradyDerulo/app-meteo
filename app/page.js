"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import "./home.css"; // Nouveau fichier CSS

// 1. Importe tes données locales
import { mockWeatherData } from "@/data/mockWeather";

// 2. L'interrupteur : true = Local, false = API réelle
const USE_MOCK = false;

//====================================================================================================

export default function Home() {
  const { user } = useAuth();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); 

  // Gestion des favoris en temps réel
  useEffect(() => {
    if (user) {
      const q = collection(db, "users", user.uid, "favorites");
      return onSnapshot(q, (snapshot) => {
        setFavorites(snapshot.docs.map(doc => doc.data()));
      });
    }
  }, [user]);

  const fetchWeather_Test_local = async () => {
    setHasSearched(true);

    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundCity = Object.keys(mockWeatherData).find(
        key => key.toLowerCase() === city.toLowerCase()
      );

      const data = foundCity ? mockWeatherData[foundCity] : null;
      setWeather(data);
      return;
    } else {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
        const data = await res.json();

        if (res.ok && data.cod === 200) {
          setWeather(data);
        } else {
          setWeather(null);
        }
      } catch (error) {
        setWeather(null);
      }
    }
  };


const fetchWeather = async () => {
   setHasSearched(true);  // on marque qu’une recherche a été faite
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    const data = await res.json();

    if (res.ok && data.cod === 200) {
      setWeather(data);
    } else {
      setWeather(null);
    }
  } catch (error) {
    setWeather(null);
  }
};

  const addFavorite = async () => {
    if (weather) {
      await setDoc(doc(db, "users", user.uid, "favorites", weather.name), {
        name: weather.name,
        temp: Math.round(weather.main.temp)
      });
    }
  };

  // Fonction helper pour obtenir l'emoji météo
  const getWeatherEmoji = (description) => {
    if (!description) return "🌤️";
    const desc = description.toLowerCase();
    if (desc.includes("rain") || desc.includes("pluie")) return "🌧️";
    if (desc.includes("cloud") || desc.includes("nuage")) return "☁️";
    if (desc.includes("clear") || desc.includes("ciel")) return "☀️";
    if (desc.includes("snow") || desc.includes("neige")) return "❄️";
    if (desc.includes("thunder") || desc.includes("orage")) return "⛈️";
    return "🌤️";
  };

  // Convertir les données API en format compatible avec l'affichage météo
  const formatWeatherForDisplay = () => {
    if (!weather) return null;
    
    // Pour le mock
    if (USE_MOCK && weather.main) {
      return {
        city: weather.name,
        temp: Math.round(weather.main.temp),
        tempMin: Math.round(weather.main.temp_min),
        tempMax: Math.round(weather.main.temp_max),
        condition: weather.weather[0].description,
        emoji: getWeatherEmoji(weather.weather[0].description),
        wind: weather.wind.speed,
        humidity: weather.main.humidity,
        uvIndex: weather.uvIndex || 4,
        country: weather.sys.country
      };
    }
    
    // Pour l'API réelle
    if (weather.main) {
      return {
        city: weather.name,
        temp: Math.round(weather.main.temp),
        tempMin: Math.round(weather.main.temp_min),
        tempMax: Math.round(weather.main.temp_max),
        condition: weather.weather[0].description,
        emoji: getWeatherEmoji(weather.weather[0].description),
        wind: weather.wind.speed,
        humidity: weather.main.humidity,
        uvIndex: 4, // L'API OpenWeather ne donne pas l'UV index par défaut
        country: weather.sys.country
      };
    }
    
    return null;
  };

  const weatherDisplay = formatWeatherForDisplay();

  return (
    <>
      <Navbar />
      <main className="weatherApp">
        <div className="searchContainer">
          <div className="searchCard">
            <h2 className="searchTitle">Rechercher la météo</h2>
            <div className="searchBox">
              <input 
                className="searchInput"
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                placeholder="Ex: Paris, Kinshasa..." 
              />
              <button className="searchButton" onClick={fetchWeather}>
                Chercher
              </button>
            </div>
          </div>
        </div>

        {weatherDisplay ? (
          <div className="currentWheater">
            <div className="card leftCard">
              <div>
                <h2>{weatherDisplay.city}, {weatherDisplay.country}</h2>
                <h1 className='temp'>{weatherDisplay.temp}°C</h1>
                <p>{weatherDisplay.tempMin}° / {weatherDisplay.tempMax}°</p>
                <p>{new Date().toLocaleDateString('fr-FR', { weekday: 'long' })}, {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>

              <div className="condition">
                <div style={{ fontSize: "100px", lineHeight: "1" }}>{weatherDisplay.emoji}</div>
                <h2 className='conditionText'>{weatherDisplay.condition}</h2>
                <button onClick={addFavorite} className="favoriteButton">⭐ Ajouter aux favoris</button>
              </div>
            </div>

            <div className="card rightCard">
              <div className="detailItem">
                <span className='detailLabel'>💨 Vent</span>
                <span className="detailValue">{weatherDisplay.wind} km/h</span>
              </div>

              <div className="detailItem">
                <span className='detailLabel'>💧 Humidité</span>
                <span className="detailValue">{weatherDisplay.humidity}%</span>
              </div>

              <div className="detailItem">
                <span className='detailLabel'>☀️ Indice UV</span>
                <span className="detailValue">{weatherDisplay.uvIndex}</span>
              </div>
            </div>
          </div>
        ) : (
          hasSearched && city && (
            <div className="errorContainer">
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: "100px", lineHeight: "1" }}>😭</div>
                <p className="errorMessage">
                  Aucune donnée trouvée pour cette ville.
                </p>
              </div>
            </div>
          )
        )}

        {favorites.length > 0 && (
          <div className="favoritesSection">
            <div className="favoritesCard">
              <h3 className="favoritesTitle">⭐ Mes villes favorites</h3>
              <div className="favoritesGrid">
                {favorites.map((fav) => {
                  let emoji = "🌤️"; 
                  if (fav.weather?.main?.toLowerCase().includes("rain")) emoji = "🌧️";
                  else if (fav.weather?.main?.toLowerCase().includes("cloud")) emoji = "☁️";
                  else if (fav.weather?.main?.toLowerCase().includes("clear")) emoji = "☀️";

                  return (
                    <div key={fav.name} className="favoriteItem">
                      <h4 className="favoriteCity">{fav.name}</h4>
                      <div className="favoriteEmoji">{emoji}</div>
                      <p className="favoriteTemp">{fav.temp}°C</p>
                      {fav.rainProb !== undefined && (
                        <p className="favoriteRainProb">
                          🌧 {fav.rainProb}% de pluie
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}