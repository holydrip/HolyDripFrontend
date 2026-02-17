export function getDiscountedPrice(price: number, discountPct?: number) {
  if (!discountPct || discountPct <= 0) return price;
  const discounted = price * (1 - discountPct / 100);
  return Math.round(discounted);
}

export function formatMoney(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
