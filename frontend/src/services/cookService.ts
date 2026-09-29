import api from './api';

export const cookService = {
  async getAll() {
    const response = await api.get('/cooks');
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/cooks/${id}`);
    return response.data;
  },

  async getNearby(lat: number, lng: number) {
    const response = await api.get('/cooks/nearby', {
      params: { lat, lng },
    });
    return response.data;
  },
};