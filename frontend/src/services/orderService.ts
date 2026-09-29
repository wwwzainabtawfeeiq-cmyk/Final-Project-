import api from './api';

export interface OrderData {
  items: { mealId: number; quantity: number }[];
  address: string;
  phone: string;
  paymentMethod: string;
  notes?: string;
  hasAllergy?: boolean;
  allergyDetails?: string;
  isEvent?: boolean;
  eventType?: string;
  eventGuests?: number;
  eventDate?: string;
  eventTime?: string;
  urgent?: boolean;
}

export const orderService = {
  async getMyOrders() {
    const response = await api.get('/orders/my');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async create(data: OrderData) {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async updateStatus(id: string, status: string) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  async cancel(id: string) {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/orders');
    return response.data;
  },
};