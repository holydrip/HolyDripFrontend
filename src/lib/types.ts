export type Category = {
  id: string;
  name: string;
  products: Product[]
};

export type Product = {
  id: string;
  name: string;
  images: string[];
  price: number;
  sizes: string[]; 
  description?: string;
  categoryId: string;
};

export type CartItem = {
  product: Product;
  size: string;
  qty: number;
  addedAt: string;
};

export type Cart = { items: CartItem[] };