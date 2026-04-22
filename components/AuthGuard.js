"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login" && pathname !== "/register") {
        router.push("/login");
      } else if (user && (pathname === "/login" || pathname === "/register")) {
        router.push("/"); // ✅ dès qu’un user est connecté, redirection vers accueil
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
}
