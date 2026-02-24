"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@deemlol/next-icons";
import Logo from "../../../public/images/logo-full-dark.png"; 
import { CategoryService } from "@/services/category.service";
import { Category } from "@/lib/types";
import { useCart } from "@/context/CartContext";

const staticLinksBefore = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
];

const staticLinksAfter = [
  { label: "About Us", href: "/about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);
  const [cartAmount, setCartAmount] = useState<number>(0)
  const {cart} = useCart()

  useEffect(() => {
    setCartAmount(cart.length)
  }, [cart])

  useLayoutEffect(() => {
    CategoryService.getAll()
      .then(res => setCategory(res));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allLinks = [
    ...staticLinksBefore,
    ...category.map(c => ({ label: c.name, href: `/catalog/${c.id}` })),
    ...staticLinksAfter
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 md:px-[70px] transition-all duration-300 ${
          scrolled 
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-white/10 py-3" 
            : "bg-[#050505] border-b border-transparent py-5"
        }`}
      >
        <Link href="/" className="relative z-50 flex items-center">
          <Image 
            src={Logo} 
            alt="Holy Drip" 
            className="w-20 h-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {allLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-sans text-[10px] font-medium uppercase tracking-[3px] text-white/60 hover:text-white transition-colors duration-300 relative group"
            >
              {l.label}
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 relative z-50">
          <Link
            href="/cart"
            className="hidden md:flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-[3px] text-white border border-white/20 px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-300"
          >
            Cart ({cartAmount})
          </Link>

          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-white"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} color="#ffffff" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-end px-6 py-6 border-b border-white/10">
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-10 h-10 text-white/50 hover:text-white transition-colors duration-200"
                >
                  <X size={24} color="currentColor" />
                </button>
              </div>

              <nav className="flex flex-col px-8 py-10 gap-6 flex-1 overflow-y-auto">
                {allLinks.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="font-fraktur text-3xl text-white/70 hover:text-white transition-colors duration-300 block"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-8 border-t border-white/10">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="font-sans flex items-center justify-center w-full h-14 text-[12px] font-medium uppercase tracking-[4px] text-black bg-white hover:bg-white/80 transition-colors duration-300"
                >
                  Cart (0)
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}