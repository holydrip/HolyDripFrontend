import ProductCard from '@/components/product-card/ProductCard';
import { Product } from '@/types/product';
import Styles from "./catalog.module.css"

export default function Page() {
  const testProducts: Product[] = [
    {id: "1", name: "Товар 1", price: 300},
    {id: "2", name: "Товар 2", price: 330},
    {id: "3", name: "Товар 3", price: 302},
    {id: "4", name: "Товар 4", price: 3030},
    {id: "5", name: "Товар 5", price: 3020},
  ];
  return (
    <>
      <div className={Styles.catalog}>
        {testProducts.map((product: Product) => (<ProductCard product={product} key={product.id}/>))}
      </div>
    </>
  )
}