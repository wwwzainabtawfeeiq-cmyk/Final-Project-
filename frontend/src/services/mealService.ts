import api from './api';

export interface MealData {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  image: string;
  category: string;
  prepTime: string;
  tags: string[];
  spicy?: boolean;
  sweet?: boolean;
}

export const mealService = {
  async getAll(params?: { category?: string; search?: string }) {
    const response = await api.get('/meals', { params });
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/meals/${id}`);
    return response.data;
  },

  async getByCook(cookId: number) {
    const response = await api.get(`/meals/cook/${cookId}`);
    return response.data;
  },

  async getFeatured() {
    const response = await api.get('/meals/featured');
    return response.data;
  },

  async create(data: MealData) {
    const response = await api.post('/meals', data);
    return response.data;
  },

  async update(id: number, data: Partial<MealData>) {
    const response = await api.put(`/meals/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/meals/${id}`);
    return response.data;
  },
};