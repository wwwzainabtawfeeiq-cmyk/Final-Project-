import API from "./api";

// جلب عروض إنقاذ الطعام
export const getFoodRescueOffers = async () => {
  const response = await API.get('/food-rescue');
  return response.data;
};

// حجز وجبة من إنقاذ الطعام
export const claimFoodRescue = async (offerId, quantity) => {
  const response = await API.post(`/food-rescue/${offerId}/claim`, { quantity });
  return response.data;
};

// إنشاء طلب جماعي
export const createGroupOrder = async (groupData) => {
  const response = await API.post('/group-orders', groupData);
  return response.data;
};
