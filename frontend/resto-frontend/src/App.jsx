import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Auth from './pages/Auth';
import ListeRestaurants from './pages/ListeRestaurants';
import RestaurantDetail from './pages/RestaurantDetail'; 


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Page d'accueil */}
                <Route path="/" element={<Accueil />} />

                {/* Page d'authentification (Connexion/Inscription) */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/restaurants" element={<ListeRestaurants />} />
                <Route path="/restaurants/:slug" element={<RestaurantDetail />} />
                {/* Route par défaut - redirige vers accueil */}
                <Route path="*" element={<Accueil />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;