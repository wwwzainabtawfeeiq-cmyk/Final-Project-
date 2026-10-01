import API from "./api";

// إرسال طلب مخصص مع تحليل الذكاء الاصطناعي
export const createCustomOrder = async (customOrderData) => {
  const response = await API.post('/orders/custom', customOrderData);
  return response.data;
};

// جلب تفاصيل الطلب المخصص
export const getCustomOrderDetails = async (id) => {
  const response = await API.get(`/orders/custom/${id}`);
  return response.data;
};

// إرسال عرض سعر من الطباخ للزبون
export const sendQuote = async (orderId, quoteData) => {
  const response = await API.put(`/orders/${orderId}/quote`, quoteData);
  return response.data;
};
