"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '../../../public/images/Logo.png';
import Image from 'next/image';
import { CategoryService } from '@/services/category.service';
import { Category } from '@/types/category';

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    CategoryService.getAll()
      .then((data) => setCategories(data))
  }, []);

  const linkStyle = "hover:opacity-70 transition duration-200 ease-in whitespace-nowrap uppercase";

  return (
    <nav className={`flex px-10 py-5 items-center gap-8 text-sm font-medium text-white bg-[#5E5E5E] overflow-x-auto`}>
      <Link href="/">
        <Image src={Logo} alt="Holy Drip Logo" width={40} height={20} priority />
      </Link>

      <div className="flex items-center gap-8">
        <Link className={linkStyle} href='/'>HOME</Link>
        <Link className={linkStyle} href='/catalog'>SALES</Link>

        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            className={linkStyle} 
            href={`/catalog/${cat.slug}`}
          >
            {cat.name}
          </Link>
        ))}

        <Link className={linkStyle} href='/about'>ABOUT US</Link>
      </div>
    </nav>
  );
}