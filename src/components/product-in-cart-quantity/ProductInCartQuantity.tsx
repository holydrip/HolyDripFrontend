"use client"
import { useCart } from '@/context/CartContext';
import { ProductInCart } from '@/types/productInCart';
import { useEffect, useState } from 'react';
import Styles from "./product-in-cart-quantity.module.css"

export default function ProductInCartQuantity({product}: { product: ProductInCart }) {
  const {addToCart, setQuantity, removeFromCart} = useCart();
  const [quantityState, setQuantityState] = useState<number>(product.quantity);
  useEffect(() => {
    setQuantityState(product.quantity);
  }, [product]);
  return (
    <>
      <div className={Styles.quantity}>
        <button className={Styles.button} onClick={() => removeFromCart(product.id)}>-</button>
        <input className={Styles.noArrows} type="number" value={quantityState.toString()} onChange={e => setQuantityState(parseInt(e.target.value) || 0)} onBlur={() => setQuantity(product.id, quantityState)}/>
        <button className={Styles.button} onClick={() => addToCart(product)}>+</button>
      </div>
      <button className={Styles.button} onClick={() => setQuantity(product.id, 0)}>Видалити</button>
    </>
  )

}