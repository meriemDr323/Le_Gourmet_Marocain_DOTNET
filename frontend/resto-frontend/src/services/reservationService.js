import axios from 'axios';

const API_URL = 'http://localhost:5048/api/reservations';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const createReservation = async (reservationData) => {
    const response = await api.post('/', reservationData);
    return response.data;
};

export const getReservation = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};
