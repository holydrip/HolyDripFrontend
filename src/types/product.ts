export interface Product  {
  id: string;
  name: string;
  images: string[];
  price: number;
  sizes: string[]; 
  description?: string;
  categoryId: string;
};