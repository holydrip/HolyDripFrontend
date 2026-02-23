"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Product } from "../../types/product";
import { Button } from "@/components/ui/Button";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const {addToCart} = useCart();

  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 700);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <Link 
      href={`/cart/${product.id}`}
      className="rounded-2xl border bg-white shadow-sm ">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="mt-3 flex items-start justify-between p-3 gap-3 flex-col md:flex-row">
        <div>
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-sm font-semibold">{product.price}</div>

          </div>
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            const defaultSize = product.sizes?.[0] || "One Size";
            addToCart(product, defaultSize); 
            setAdded(true);
          }}
          className="shrink-0"
          variant={added ? "secondary" : "primary"}
          disabled={added}
        >
          {added ? "Added ✓" : "Add"}
        </Button>
      </div>
    </Link>
  );
}
