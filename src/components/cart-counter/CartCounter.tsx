"use client"
import { useCart } from '@/context/CartContext';
import Styles from './cart-counter.module.css';
import { ProductInCart } from '@/types/productInCart';

export default function CartCounter() {
  const { cart } = useCart();
  const caclulateAmount = (): number => {
    let number: number = 0;
    cart.forEach((product: ProductInCart) => number += product.quantity);
    return number;
  }
  return (
    <>
      {cart.length ? <div className={Styles.counter}>{caclulateAmount()}</div> : null}
    </>
  )
}