"use client"
import { useCart } from '@/context/CartContext';
import ProductCardInCart from '@/components/product-card-in-cart/ProductCardInCart';
import { ProductInCart } from '@/types/productInCart';
import Styles from './cart.module.css';
import { useState } from 'react';
import OrderForm from '@/components/order-form/OrderForm';

export default function Page() {
  const [orderOpen, setOrderOpen] = useState<boolean>(false);
  const {cart} = useCart();
  const calcSum = (): number => {
    let sum: number = 0;
    cart.forEach((product: ProductInCart) => sum += product.price * product.quantity);
    return sum;
  }
  const changeOrderOpenState = () => {
    setOrderOpen(prev => !prev);
  }
  return (
    <div className={Styles.cart}>
      {orderOpen ? <OrderForm changeOrderOpenState={changeOrderOpenState}/> : null}
      {cart.length ? cart.map((product: ProductInCart, index: number) => (
          product.quantity ? <ProductCardInCart key={index} product={product}/> : null)) :
        <h1>Корзина пуста! Настав час її заповнити!</h1>}
      {cart.length ? <h1 className={Styles.price}>Ціна: {calcSum()} UAH</h1> : null}
      {cart.length
        ? <button
          className={Styles.orderButton}
          onClick={changeOrderOpenState}>Оформити замовлення</button>
        : null}
    </div>
  )
}