import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={product.id}
      className="group relative flex flex-col w-full bg-transparent overflow-hidden select-none transition-all duration-500 ease-out hover:-translate-y-1">
      <div className="relative w-full aspect-[2/2] overflow-hidden bg-white/[0.02]">
        <Image
          src={product.images[0] === null ? product.images[1] : product.images[0]}
          fill
          alt={product.name}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <div className="flex flex-col items-center gap-3 pt-5 pb-2">
        <div className="flex flex-col items-start gap-1.5 w-full text-center">
          <h2 className="font-sans text-[12px] sm:text-[13px] font-medium uppercase tracking-[3px] text-white/90 truncate">
            {product.name}
          </h2>
          <p className="font-sans text-[12px] text-white/40 font-light tracking-[2px]">
            {product.price.toLocaleString()} UAH
          </p>
        </div>
      </div>
    </Link>
  );
}