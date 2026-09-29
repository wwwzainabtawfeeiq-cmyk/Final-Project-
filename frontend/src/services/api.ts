import axios from 'axios';
import toast from 'react-hot-toast';

// ====== إعدادات Axios ======
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ====== Interceptor: إضافة JWT ======
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ====== Interceptor: معالجة الأخطاء ======
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 - غير مصرح
    if (error.response?.status === 401) {
      localStorage.removeItem('bf_token');
      localStorage.removeItem('bf_user');
      if (window.location.pathname !== '/login') {
        toast.error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
        window.location.href = '/login';
      }
    }

    // 403 - ممنوع
    if (error.response?.status === 403) {
      toast.error('ليس لديك صلاحية لهذا الإجراء');
    }

    // 500 - خطأ في السيرفر
    if (error.response?.status >= 500) {
      toast.error('حدث خطأ في السيرفر، حاول لاحقًا');
    }

    // بدون اتصال
    if (!error.response) {
      toast.error('تحقق من اتصالك بالإنترنت');
    }

    return Promise.reject(error);
  }
);

export default api;