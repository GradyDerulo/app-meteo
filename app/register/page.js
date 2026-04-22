"use client";
import { useState } from "react";
import { auth } from "@/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";


export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Compte créé avec succès ! Redirection en cours...");
      
      // ✅ reset
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Cet email est déjà utilisé. Veuillez vous connecter.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Veuillez entrer un email valide.");
      } else {
        setErrorMessage("Erreur: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  
    <div className="container" style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
    <form className="card" style={{ width: "400px" }} onSubmit={handleRegister}>
      <h2>Créer un compte</h2>

      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
        Rejoignez WeatherPro pour sauvegarder vos villes.
      </p>

      <input
        type="email"
        placeholder="Email professionnel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isSubmitting}
        autoComplete="off"
      />

      <input
        type="password"
        placeholder="Mot de passe (6 caractères min.)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isSubmitting}
        autoComplete="new-password"
      />

      <button type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
        {isSubmitting ? "Création en cours..." : "S'inscrire"}
      </button>

      {successMessage && (
        <p style={{ marginTop: "1rem", color: "green", fontWeight: "600" }}>
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p style={{ marginTop: "1rem", color: "red", fontWeight: "600" }}>
          {errorMessage}
        </p>
      )}

      <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem" }}>
        Déjà un compte ?{" "}
        <Link href="/login" style={{ color: "#0070f3", fontWeight: "600" }}>
          Se connecter
        </Link>
      </p>
    </form>
  </div>
);

}
