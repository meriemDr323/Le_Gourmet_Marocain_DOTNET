import axios from 'axios';

const API_URL = 'http://localhost:5048/api/restaurants';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getRestaurants = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.ville) params.append('ville', filters.ville);
    if (filters.typeCuisine) params.append('typeCuisine', filters.typeCuisine);
    if (filters.prixMin) params.append('prixMin', filters.prixMin);
    if (filters.prixMax) params.append('prixMax', filters.prixMax);
    if (filters.noteMin) params.append('noteMin', filters.noteMin);

    const response = await api.get(`?${params.toString()}`);
    return response.data;
};

export const getRestaurantById = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const getRestaurantBySlug = async (slug) => {
    const response = await api.get(`/slug/${slug}`);
    return response.data;
};
