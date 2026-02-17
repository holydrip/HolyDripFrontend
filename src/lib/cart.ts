"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types";

export type CartItem = {
  product: Product;
  qty: number;
  size: string;
};

type CartState = {
  items: Record<string, CartItem>;
  add: (p: Product, size: string) => void;
  remove: (cartId: string) => void;
  setQty: (cartId: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},

      add: (p, size) =>
        set((state) => {
          const cartId = `${p.id}-${size}`; 
          
          const existing = state.items[cartId];
          const qty = existing ? existing.qty + 1 : 1;

          return {
            items: {
              ...state.items,
              [cartId]: { 
                product: p, 
                qty, 
                size
              },
            },
          };
        }),

      remove: (cartId) =>
        set((state) => {
          const next = { ...state.items };
          delete next[cartId];
          return { items: next };
        }),

      setQty: (cartId, qty) =>
        set((state) => {
          if (!state.items[cartId]) return state;
          const clamped = Math.max(1, Math.min(99, qty));
          return {
            items: {
              ...state.items,
              [cartId]: { ...state.items[cartId], qty: clamped },
            },
          };
        }),

      clear: () => set({ items: {} }),
    }),
    { name: "shop-mvp-cart" }
  )
);