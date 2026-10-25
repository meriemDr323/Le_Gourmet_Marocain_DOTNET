# Le Gourmet Marocain

Plateforme de découverte et de réservation de restaurants marocains. Les utilisateurs peuvent explorer des restaurants, consulter leurs détails (cuisine, prix, services), et effectuer des réservations en ligne.

## Stack technique

- **Frontend** : React 19 + Vite, React Router, Axios, Recharts, Lucide React
- **Backend** : ASP.NET Core (.NET), Entity Framework Core, SQL Server
- **API** : REST avec documentation Swagger

## Fonctionnalités

- Inscription et connexion des utilisateurs
- Recherche et filtrage de restaurants (ville, type de cuisine, prix, note)
- Fiche détaillée par restaurant (horaires, services, galerie photos)
- Système de réservation en ligne avec code de confirmation
- Avis et notations des restaurants

## Structure du projet

```
├── backend/
│   └── RestoPlatform/        # API ASP.NET Core
│       ├── Controllers/      # AuthController, RestaurantsController, ReservationsController
│       ├── Models/           # Restaurant, Reservation, User, Avis...
│       ├── DTOs/
│       ├── Data/             # AppDbContext (EF Core)
│       └── Services/
└── frontend/
    └── resto-frontend/       # Application React + Vite
        └── src/
```

## Lancer le projet

### Backend

```bash
cd backend/RestoPlatform
dotnet restore
dotnet run
```

L'API sera disponible sur `https://localhost:7000` et Swagger sur `/swagger`.

> Configurer la chaîne de connexion SQL Server dans `appsettings.json` avant de lancer.

### Frontend

```bash
cd frontend/resto-frontend
npm install
npm run dev
```

L'application sera disponible sur `http://localhost:5173`.

## Configuration

Dans `backend/RestoPlatform/appsettings.json`, renseigner la connexion à la base de données :

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=...;Database=LeGourmetMarocain;..."
}
```
