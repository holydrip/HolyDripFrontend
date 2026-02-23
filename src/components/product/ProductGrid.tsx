import { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ items }: { items: Product[] }) {
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 grid-cols-1">
            {items.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}
