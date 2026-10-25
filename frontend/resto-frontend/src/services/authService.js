import axios from 'axios';

// ✅ BON PORT - Votre backend tourne sur 5048
const API_URL = 'http://localhost:5048/api/auth';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour logger les erreurs
api.interceptors.response.use(
    response => response,
    error => {
        console.error('Erreur API:', error);
        if (error.response) {
            console.error('Données:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            console.error('Pas de réponse du serveur');
        }
        return Promise.reject(error);
    }
);

export const register = async (userData) => {
    const response = await api.post('/register', {
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        telephone: userData.telephone,
        password: userData.password
    });
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
};
