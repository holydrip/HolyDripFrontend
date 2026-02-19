import { Product } from "./product"

export interface ICategory {
    id: string
    name: string
    slug: string
    products: Product[]
}