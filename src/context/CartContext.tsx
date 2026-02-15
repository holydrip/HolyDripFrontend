"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ProductInCart } from '@/types/productInCart';
import { Product } from '@/types/product';

interface CartContextType {
  cart: ProductInCart[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
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

  const isExists = (id: string): boolean => {
    return Boolean(cart.find((cartProduct: ProductInCart) => cartProduct.id === id));
  }

  const addToCart = (item: Product) => {
    setCart(prev => {
      if (isExists(item.id)) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? {...cartItem, quantity: cartItem.quantity + 1}
            : cartItem,
        );
      } else {
        return [...prev, {...item, quantity: 1}];
      }
    });
  }

  const setQuantity = (id: string, quantity: number) => {
    if (!isExists(id)) return;
    setCart(prev => {
      return prev.map((cartItem) =>
        cartItem.id === id
          ? {...cartItem, quantity}
          : cartItem,
      )
        .filter((cartItem) => cartItem.quantity > 0);
    })
  }

  const removeFromCart = (id: string) => {
    if (!isExists(id)) return;
    setCart((prev) =>
      prev
        .map((cartItem) =>
          cartItem.id === id
            ? {...cartItem, quantity: cartItem.quantity - 1}
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0),
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
