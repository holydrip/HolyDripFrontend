import ProductClient from "@/components/productPage/ProductClient";
import { ProductService } from "@/services/product.service";
import { notFound } from "next/navigation";

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const product = await ProductService.getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}