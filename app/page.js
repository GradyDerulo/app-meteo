"use client";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";

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

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="card">
          <h2>Rechercher la météo</h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: Paris, Kinshasa..." />
            <button onClick={fetchWeather}>Chercher</button>
          </div>

            {weather ? (
  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
    <h3>{weather.name}, {weather.sys.country}</h3>
    <h1 style={{ fontSize: '4rem' }}>{Math.round(weather.main.temp)}°C</h1>
    <p>{weather.weather[0].description}</p>
    <button onClick={addFavorite} style={{ background: '#f59e0b', marginTop: '1rem' }}>⭐ Favoris</button>
  </div>
) : (
 hasSearched && city && (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <span style={{ fontSize: '5rem' }}>😭</span>
      <p style={{ marginTop: '1rem', color: 'red', fontWeight: '600' }}>
        Aucune donnée trouvée pour cette ville .
      </p>
    </div>
  )
)}


        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Mes villes sauvegardées</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginTop: '1rem' }}>
          {favorites.map((fav) => {
     
      let emoji = "🌤"; 
      if (fav.weather?.main.toLowerCase().includes("rain")) emoji = "🌧";
      else if (fav.weather?.main.toLowerCase().includes("cloud")) emoji = "☁️";
      else if (fav.weather?.main.toLowerCase().includes("clear")) emoji = "☀️";

      return (
        <div key={fav.name} style={{
          padding: '20px',
          border: '1px solid #eee',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: 'var(--shadow)',
          background: 'var(--white)'
        }}>
          <h4 style={{ marginBottom: '10px' }}>{fav.name}</h4>
          <div style={{ fontSize: '2.5rem' }}>{emoji}</div>
          <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{fav.temp}°C</p>
          {fav.rainProb !== undefined && (
            <p style={{ fontSize: '0.9rem', color: '#555' }}>
              🌧 {fav.rainProb}% pluie
            </p>
          )}
        </div>
      );
    })}
          </div>
        </div>
      </main>
    </>
  );
}