"use client";
import Link from 'next/link';
import Styles from "./header.module.css"
import CartCounter from '@/components/cart-counter/CartCounter';
import { Geist } from "next/font/google";
import { SearchBar } from '../search-bar/SearchBar';
import { useState } from 'react';

const geist = Geist({subsets: ['latin-ext']})

export default function Header() {
  const [loginState, setLoginState] = useState<"Login" | "Account">("Login")
  return (
    <div className={`${Styles.header} ${geist.className}`}>
      <Link className={Styles.logo} href="/"/>
      <SearchBar/>
      <div className={Styles.links}>
        <Link className={Styles.link} href="/login">{loginState}</Link>
        {loginState === "Login" ? <p style={{color: "white"}}>|</p> : undefined}
        {loginState === "Login" ? ( <Link className={Styles.link} href="/sign-up">Sign Up</Link>) : undefined}
      </div>
      {/* <div>
        <Link className={Styles.cart} href="/cart"/>
        <CartCounter/>
      </div> */}
    </div>
  )
}