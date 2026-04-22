
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";



const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700"], // On définit l'epaisseur (Normal, Semi-Bold, Bold)
});

export const metadata = {
  title: "Weather App",
  description: "Application météo moderne avec Next.js et Firebase",
  openGraph:{
    
  }
};

export default function RootLayout({ children }) {
  return (
   <html lang="fr">

      <body className={poppins.className}>
     <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
