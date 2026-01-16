export const getInitialConverter = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((initial) => initial.charAt(0))
    .join("")
    .toUpperCase();
};

// utils/priceUtils.ts
export function getDiscountPercentage(
  price: number,
  originalPrice: number
): number {
  if (originalPrice <= 0) return 0; // Avoid division by zero
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
