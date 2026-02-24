"use client";

import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import { Product } from "@/lib/types";

export default function AddToCartButton({
  product,
  size,
}: {
  product: Product;
  size: string | null;
}) {
  const { addToCart } = useCart();

  const disabled = !size && product.sizes.length > 0;

  const handleClick = () => {
    if (disabled) {
      toast.error("Please select a size.");
      return;
    }

    const selectedSize = size || "One Size";

    addToCart(product, selectedSize);

    toast.success("Added to cart", {
      description: `${product.name} • ${selectedSize}`,
    });
  };

  return (
    <button
      type="button"
      // disabled={disabled}
      onClick={handleClick}
      className={
        "mt-2 h-10 w-full rounded-lg bg-black text-sm font-semibold text-white shadow-sm transition " +
        (disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:opacity-90 cursor-pointer")
      }
    >
      Add to cart
    </button>
  );
}