"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Connexion réussie ! Redirection en cours...");
      
      // ✅ Réinitialiser les champs
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErrorMessage("Aucun compte trouvé avec cet email.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Mot de passe incorrect.");
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
      <form className="card" style={{ width: "400px" }} onSubmit={handleLogin} autoComplete="off">
        <h2>Connexion</h2>

        <input
          type="email"
          placeholder="Email professionnel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          autoComplete="off"
          style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
          autoComplete="new-password"
          style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px",
            width: "100%",
            backgroundColor: isSubmitting ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </button>

        {/* ✅ Feedback messages */}
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
          Nouveau ici ?{" "}
          <Link href="/register" style={{ color: "#0070f3", fontWeight: "600" }}>
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
