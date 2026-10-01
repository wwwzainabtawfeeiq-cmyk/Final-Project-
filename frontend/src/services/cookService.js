import API from "./api";

export const getCooks = async () => {
  const response = await API.get("/public-cooks");
  return response.data;
};

export const getCook = async (id) => {
  const response = await API.get(`/public-cooks/${id}`);
  return response.data;
};

export const getNearbyCooks = async () => {
  const response = await API.get("/public-cooks");
  return response.data;
};
