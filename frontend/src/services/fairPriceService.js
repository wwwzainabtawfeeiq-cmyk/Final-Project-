import API from "./api";

// جلب حساب السعر العادل لوجبة
export const getFairPrice = async (mealId) => {
  const response = await API.get(`/fair-price/meal/${mealId}`);
  return response.data;
};

// تحديد التكلفة بواسطة الطباخ
export const setMealCost = async (mealId, cost) => {
  const response = await API.post(`/fair-price/meal/${mealId}`, { cost });
  return response.data;
};
