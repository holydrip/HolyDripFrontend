import Styles from "./product-card-in-cart.module.css";
import { ProductInCart } from '@/types/productInCart';
import ProductInCartQuantity from '@/components/product-in-cart-quantity/ProductInCartQuantity';

export default function ProductCardInCart({product}: { product: ProductInCart }) {
  return (
    <div className={Styles.card}>
      <div>
        <h2>{product.name}</h2>
      </div>
      <h3>{product.price} UAH</h3>
      <ProductInCartQuantity product={product} />
    </div>
  )
}