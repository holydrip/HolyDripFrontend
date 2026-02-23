import { Product } from "../types/product";
import { Category } from "@/types/category";

export const categories: Category[] = [
  {
    id: "1",
    name: "Cars",
    products: [{
      id: "1",
      name: "City Car 1.6",
      images: [
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80&auto=format&fit=crop",
      ],
      price: 12000,
      categoryId: "1",
      sizes: ["S", "M", "L"],
      description: "Отличный городской автомобиль с экономичным расходом.",
    }],
    slug: "123"
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "City Car 1.6",
    images: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80&auto=format&fit=crop",
      // "https://images.unsplash.com/photo-1542362568-b07e54358753?w=1200&q=80&auto=format&fit=crop",
    ],
    price: 12000,
    categoryId: "1",
    sizes: ["S", "M", "L"],
    description: "Отличный городской автомобиль с экономичным расходом.",
  },
];
