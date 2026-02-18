"use client";

import { toast } from "sonner";
import { useCart } from "@/lib/cart"; 
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product, size }: { product: Product; size: string | null }) {
  const addItem = useCart((state) => state.add);
  
  const disabled = !size && product.sizes.length > 0;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!size && product.sizes.length > 0) return toast.error("Please select a size.");
        
        addItem(product, size || "One Size"); 
        
        toast.success("Added to cart", { description: `${product.name} • ${size}` });
      }}
      className={
        "cursor-pointer mt-2 h-10 w-full rounded-lg bg-black text-sm font-semibold text-white shadow-sm transition" +
        (disabled ? "cursor-not-allowed opacity-50" : "hover:opacity-90")
      }
    >
      Add to cart
    </button>
  );
}