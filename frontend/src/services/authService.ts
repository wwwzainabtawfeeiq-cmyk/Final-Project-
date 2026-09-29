import api from './api';

export interface LoginData {
  email: string;
  password: string;
  role?: 'customer' | 'cook' | 'admin';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer' | 'cook' | 'admin';
  specialty?: string;
  area?: string;
}

export const authService = {
  // تسجيل الدخول
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('bf_token', response.data.token);
    }
    return response.data;
  },

  // تسجيل حساب جديد
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('bf_token', response.data.token);
    }
    return response.data;
  },

  // الحصول على بيانات المستخدم الحالي
  async me() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // تسجيل الخروج
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('bf_token');
      localStorage.removeItem('bf_user');
    }
  },
};