import API from "./api";

export const getMeals = async () => {
  const response = await API.get("/public-meals");
  return response.data;
};

export const getMeal = async (id) => {
  const response = await API.get(`/public-meals/${id}`);
  return response.data;
};

export const getMealsByCook = async (cookId) => {
  const response = await API.get(`/public-meals?cook_id=${cookId}`);
  return response.data;
};

export const getFeaturedMeals = async () => {
  const response = await API.get("/public-meals");
  return response.data;
};
