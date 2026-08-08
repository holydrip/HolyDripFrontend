export type Category = {
  id: string;
  name: string;
  slug: string;
  products: Product[]
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  sizes: string[]; 
  description?: string;
  measurements?: { size: string, details: string }[];
  categoryId: string;
};

export type CartItem = {
  product: Product;
  size: string;
  qty: number;
  addedAt: string;
};

export type Cart = { items: CartItem[] };

export interface ProductInCart {
  id: string;
  name: string;
  price: number;
  size: string;
  images: string[];
  quantity: number;
}

export interface ITelegramBot {
  name: string
  phone: string
  telegram: string
  items: {
    name: string;
    size: string;
  }[]
  totalPrice: number
}
