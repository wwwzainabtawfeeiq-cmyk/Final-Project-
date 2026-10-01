import API from "./api";

export const getMyOrders = async () => {
  const response = await API.get("/orders/my-orders");
  return response.data;
};

export const getOrder = async (id) => {
  const response = await API.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (data) => {
  const response = await API.post("/orders", data);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await API.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await API.put(`/orders/${id}/cancel`);
  return response.data;
};
