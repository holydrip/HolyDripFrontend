import type { Metadata } from "next";
import ProductClient from "@/components/productPage/ProductClient";
import { ProductService } from "@/services/product.service";
import { notFound } from "next/navigation";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Товар не знайдено",
    };
  }

  return {
    title: product.name,
    description: product.description || `Придбати ${product.name} в архіві HOLY DRIP. Оригінальний дизайнерський одяг. Доставка по Україні.`,
    alternates: {
      canonical: `/product/${slug}`,
    },
    openGraph: {
      title: product.name,
      description: `Ціна: ${product.price} ₴. ${product.description || "Кураторський fashion-архів у Києві."}`,
      url: `https://holydrip.com.ua/product/${slug}`,
      images: product.images?.length ? [
        {
          url: product.images[0],
          width: 1080,
          height: 1080,
          alt: product.name,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: `Ціна: ${product.price} ₴`,
      images: product.images?.length ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  let relatedProducts: any[] = [];
  try {
    if (product.categoryId) {
      const categoryProducts = await ProductService.getProductsByCategoryId(product.categoryId);
      relatedProducts = (categoryProducts || []).filter((p) => p.id !== product.id && p.slug !== product.slug);
    }
    if (!relatedProducts || relatedProducts.length < 4) {
      const allProducts = await ProductService.getAll();
      const additional = (allProducts || []).filter(
        (p) => p.id !== product.id && p.slug !== product.slug && !relatedProducts.some((rp) => rp.id === p.id)
      );
      relatedProducts = [...relatedProducts, ...additional].slice(0, 4);
    } else {
      relatedProducts = relatedProducts.slice(0, 4);
    }
  } catch (e) {
    console.error("Error fetching related products:", e);
  }

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
