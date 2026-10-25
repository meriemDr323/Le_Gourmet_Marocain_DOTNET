import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001/api';

// Configuration axios avec intercepteur pour le token
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Service pour les avis
const avisService = {
    // Récupérer les avis d'un restaurant avec filtres
    getAvisByRestaurant: async (restaurantId, filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.note) params.append('Note', filters.note);
            if (filters.noteMin) params.append('NoteMin', filters.noteMin);
            if (filters.triPar) params.append('TriPar', filters.triPar);
            if (filters.page) params.append('Page', filters.page);
            if (filters.pageSize) params.append('PageSize', filters.pageSize);
            if (filters.avecPhotos) params.append('AvecPhotos', filters.avecPhotos);

            const response = await axiosInstance.get(
                `/Avis/restaurant/${restaurantId}?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des avis:', error);
            throw error;
        }
    },

    // Récupérer les statistiques d'un restaurant
    getStatistiques: async (restaurantId) => {
        try {
            const response = await axiosInstance.get(
                `/Avis/restaurant/${restaurantId}/statistiques`
            );
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    },

    // Créer un nouvel avis
    createAvis: async (avisData) => {
        try {
            const response = await axiosInstance.post('/Avis', avisData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de l\'avis:', error);
            throw error;
        }
    },

    // Récupérer un avis par ID
    getAvisById: async (avisId) => {
        try {
            const response = await axiosInstance.get(`/Avis/${avisId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'avis:', error);
            throw error;
        }
    },

    // Mettre à jour un avis
    updateAvis: async (avisId, avisData) => {
        try {
            const response = await axiosInstance.put(`/Avis/${avisId}`, avisData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'avis:', error);
            throw error;
        }
    },

    // Supprimer un avis
    deleteAvis: async (avisId) => {
        try {
            const response = await axiosInstance.delete(`/Avis/${avisId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'avis:', error);
            throw error;
        }
    },

    // Récupérer mes avis
    getMyAvis: async () => {
        try {
            const response = await axiosInstance.get('/Avis/user/mes-avis');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de mes avis:', error);
            throw error;
        }
    },

    // Upload de photos (exemple avec FormData)
    uploadPhotos: async (files) => {
        try {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`photos`, file);
            });

            const response = await axiosInstance.post('/Upload/photos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data; // Retourne les URLs des photos uploadées
        } catch (error) {
            console.error('Erreur lors de l\'upload des photos:', error);
            throw error;
        }
    }
};

export default avisService;