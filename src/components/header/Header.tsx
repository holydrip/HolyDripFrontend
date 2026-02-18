"use client";
import Link from 'next/link';
import { Geist } from "next/font/google";
import Logo from '../../../public/images/Logo.png'
import Image from 'next/image';


const geist = Geist({subsets: ['latin-ext']})

export default function Header() {
    return (
    <div className={`flex px-10 py-5 items-center gap-15 text-md text-white bg-[#5E5E5E] ${geist.className}`}>
      <Image src={Logo} alt="logo"></Image>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='/'>HOME</Link>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='/catalog'>SALES</Link>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='#'>HOODIES</Link>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='#'>T-SHIRTS</Link>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='#'>SHIRTS</Link>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='#'>JEANS</Link>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='#'>SHORTS</Link>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='#'>HEADWEAR</Link>
      <Link className='hover:opacity-90 transition duration-100 ease-in' href='#'>ABOUT US</Link>
    </div>
  )
}