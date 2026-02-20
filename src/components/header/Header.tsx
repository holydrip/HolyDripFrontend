"use client";
import Link from "next/link";
import { Geist } from "next/font/google";
import Logo from "../../../public/images/Logo.png";
import Image from "next/image";
import { useState } from "react";
import { Menu } from "@deemlol/next-icons";
import { X } from "@deemlol/next-icons";

const geist = Geist({ subsets: ["latin-ext"] });

export default function Header() {
  const [linksOpened, setLinksOpened] = useState(false);
  return (
    <div
      className={`flex px-5 py-5 items-center md:gap-10 gap-5 border-b-1 border-gray md:justify-start text-black justify-between bg-[#FFFFFF] ${geist.className}`}
    >
      <Image src={Logo} alt="logo" className="w-20" />
      <div
        className={`md:flex md:flex-row md:relative text-nowrap items-center text-xs md:text-sm z-999 lg:text-md lg:gap-10 gap-5 ${linksOpened ? "flex flex-col justify-center text-white bg-[#000000] top-0 left-0 w-full h-full absolute" : "hidden"} `}
      >
        <X
          size={32}
          color="#FFFFFF"
          className={`${!linksOpened ? "hidden" : "block"} hover:cursor-pointer`}
          onClick={() => {
            setLinksOpened(false);
          }}
        />
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="/"
        >
          HOME
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="/catalog"
        >
          SALES
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="#"
        >
          HOODIES
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="#"
        >
          T-SHIRTS
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="#"
        >
          SHIRTS
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="#"
        >
          JEANS
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="#"
        >
          SHORTS
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="#"
        >
          HEADWEAR
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="/about"
        >
          ABOUT US
        </Link>
        <Link
          className="hover:opacity-90 transition duration-100 ease-in"
          href="/cart"
        >
          CART
        </Link>
      </div>
      <Menu
        size={24}
        color="#000000"
        className="md:hidden block hover:cursor-pointer"
        onClick={() => {
          setLinksOpened(true);
          console.log(linksOpened);
          setLinksOpened(true);
        }}
      />
    </div>
  );
}
