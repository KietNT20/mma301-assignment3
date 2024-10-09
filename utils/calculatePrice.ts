export const calculatePriceSale = (
  priceInit: number,
  limitedTimeDeal: number
) => {
  if (!limitedTimeDeal) return 0;
  return priceInit - (priceInit * limitedTimeDeal);
};

export const calculateAverageRating = (reviews: any) => {
  if (!reviews || reviews.length === 0) return 0;
  const totalStars = reviews.reduce(
    (sum: number, review: any) => sum + review.star,
    0
  );
  return totalStars / reviews.length;
};
