import API from "./api";

export const getCookReviews = async (cookId) => {
  const response = await API.get(`/reviews/cook/${cookId}`);
  return response.data;
};

export const createReview = async (data) => {
  const response = await API.post("/reviews", data);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await API.get("/reviews/my-reviews");
  return response.data;
};

export const updateReview = async (id, data) => {
  const response = await API.put(`/reviews/${id}`, data);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await API.delete(`/reviews/${id}`);
  return response.data;
};
