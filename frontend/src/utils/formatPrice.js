export const formatPrice = (price) => {
  return new Intl.NumberFormat("ar-IQ").format(Number(price) || 0) + " د.ع";
};
