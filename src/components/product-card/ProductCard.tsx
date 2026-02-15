import { Product } from "@/types/product";
import AddToCartButton from "@/components/add-to-cart-button/AddToCartButton";
import Styles from "./product-card.module.css";
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className={Styles.card}>
      <div className={Styles.cardImage}></div>
      <div>
        <h1>{product.name}</h1>
        <h3>{product.price} UAH</h3>
      </div>
      <AddToCartButton product={product} />
    </div>
  );
}
