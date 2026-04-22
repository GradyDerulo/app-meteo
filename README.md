☁️ WeatherPro - Application Météo Prédictive

Une application web moderne permettant de consulter la météo en temps réel et de gérer ses villes favorites. Développée en 24h pour démontrer une maîtrise de Next.js 14 et Firebase Auth.


Fonctionnalités 
                Authentification sécurisée : Inscription et connexion via Firebase.

                Protection des routes : AuthGuard personnalisé pour sécuriser le Dashboard.

                Gestion d'état : Utilisation du Context API de React pour la session utilisateur.

Stack Technique
                Framework : Next.js 14 (App Router)
                Authentification : Firebase Auth
                Styles : CSS Modules (pour une isolation parfaite des composants)

Pour tester le projet sur votre machine :

1. Cloner le dépôt : 
                    git clone [TON_LIEN_GITHUB]

2. Installer les dépendances :
                                npm install

3. Créer un fichier .env.local à la racine et ajouter vos clés Firebase

NEXT_PUBLIC_FIREBASE_API_KEY=votre_cle_ici
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_domaine_ici
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_id_ici
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket_ici
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messagin_sender_id_ici
NEXT_PUBLIC_FIREBASE_APP_ID=1:971376503192:web:votre_id_app_id_ici

NEXT_PUBLIC_WEATHER_API_KEY=votre_cle_openweathermap
