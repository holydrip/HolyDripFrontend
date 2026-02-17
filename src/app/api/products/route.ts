import { NextResponse } from "next/server";
import { products } from "@/lib/mockData";
import { getDiscountedPrice } from "@/lib/pricing";

function toNumber(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category"); // slug
  const featured = searchParams.get("featured") === "true";
  const types = searchParams.getAll("type"); // multiple
  const min = toNumber(searchParams.get("min"), 0);
  const max = toNumber(searchParams.get("max"), Number.MAX_SAFE_INTEGER);

  const sort = searchParams.get("sort") || "relevance"; 
  // "price_asc" | "price_desc" | "discount_desc"

  const page = Math.max(1, toNumber(searchParams.get("page"), 1));
  const limit = Math.min(24, Math.max(4, toNumber(searchParams.get("limit"), 12)));

  let filtered = products.slice();

  if (category) filtered = filtered.filter(p => p.categorySlug === category);
  if (featured) filtered = filtered.filter(p => p.featured);

  if (types.length > 0) {
    filtered = filtered.filter(p => types.includes(p.type));
  }

  filtered = filtered.filter(p => {
    const finalPrice = getDiscountedPrice(p.price, p.discountPct);
    return finalPrice >= min && finalPrice <= max;
  });

  if (sort === "price_asc") {
    filtered.sort((a, b) => getDiscountedPrice(a.price, a.discountPct) - getDiscountedPrice(b.price, b.discountPct));
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => getDiscountedPrice(b.price, b.discountPct) - getDiscountedPrice(a.price, a.discountPct));
  } else if (sort === "discount_desc") {
    filtered.sort((a, b) => (b.discountPct || 0) - (a.discountPct || 0));
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  const items = filtered.slice(start, end);
  const hasMore = end < total;

  return NextResponse.json({
    items,
    page,
    limit,
    total,
    hasMore,
  });
}
