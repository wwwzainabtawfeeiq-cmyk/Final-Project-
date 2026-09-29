import api from './api';

export interface ReviewData {
  orderId: string;
  cookId: number;
  rating: number;
  comment: string;
}

export const reviewService = {
  async getByCook(cookId: number) {
    const response = await api.get(`/reviews/cook/${cookId}`);
    return response.data;
  },

  async create(data: ReviewData) {
    const response = await api.post('/reviews', data);
    return response.data;
  },
};