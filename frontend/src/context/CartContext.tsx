"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ProductInCart, Product } from '@/lib/types';

interface CartContextType {
  cart: ProductInCart[];
  addToCart: (item: Product, size: string) => void;
  removeFromCart: (id: string, size: string) => void;
  setQuantity: (id: string, size: string, quantity: number) => void; 
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({children}: { children: ReactNode }) {
  const [cart, setCart] = useState<ProductInCart[]>([]);

  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const isExists = (id: string, size: string): boolean => {
    return Boolean(cart.find((cartProduct) => cartProduct.id === id && cartProduct.size === size));
  }

  const addToCart = (item: Product, size: string) => {
    setCart(prev => {
      if (isExists(item.id, size)) {
        return prev.map((cartItem) =>
          cartItem.id === item.id && cartItem.size === size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      } else {
        return [...prev, { ...item, quantity: 1, size }];
      }
    });
  }

  const setQuantity = (id: string, size: string, quantity: number) => {
    if (!isExists(id, size)) return;
    setCart(prev => {
      return prev.map((cartItem) =>
        cartItem.id === id && cartItem.size === size
          ? { ...cartItem, quantity }
          : cartItem,
      ).filter((cartItem) => cartItem.quantity > 0);
    })
  }

  const removeFromCart = (id: string, size: string) => {
    if (!isExists(id, size)) return;
    setCart((prev) =>
      prev.map((cartItem) =>
        cartItem.id === id && cartItem.size === size
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      ).filter((cartItem) => cartItem.quantity > 0),
    );
  }

  const clearCart = () => {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{cart, addToCart, removeFromCart, setQuantity, clearCart}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}