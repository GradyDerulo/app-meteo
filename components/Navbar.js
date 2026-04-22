"use client";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth(); 

  const handleLogout = async () => {
    try {
      await logout(); 
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };
  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>☁️ WeatherPro</span>
      
      <div className={styles.userSection}>
        
        {user && <span className={styles.email}>{user.email}</span>}
        
        <button 
          onClick={handleLogout} 
          className={styles.logoutBtn}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}