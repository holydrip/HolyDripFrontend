"use client"
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import Styles from './add-to-cart-button.module.css'

export default function AddToCartButton({product}: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <button className={Styles.button} onClick={() => addToCart(product)}>Додати в корзину</button>
  )
}
