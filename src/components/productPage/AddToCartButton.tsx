"use client";

// @ts-ignore
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import { Product } from "@/lib/types";
import { useTranslation } from "@/hooks/useTranslation";

export default function AddToCartButton({
  product,
  size,
}: {
  product: Product;
  size: string | null;
}) {
  const { addToCart } = useCart();
  const { t } = useTranslation("Product");

  const disabled = !size && product.sizes.length > 0;

  const handleClick = () => {
    if (disabled) {
      toast.error(t("please_choose_size"));
      return;
    }

    const selectedSize = size || "One Size";

    addToCart(product, selectedSize);

    toast.success(t("added_to_cart"), {
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
      {t("add_to_cart")}
    </button>
  );
}