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
    description: product.description || `Придбати ${product.name} в архіві HOLY DRIP. Оригінальний дизайнерський одяг.`,
    openGraph: {
      title: product.name,
      description: `Ціна: ${product.price} ₴. ${product.description || ""}`,
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

  return <ProductClient product={product} />;
}