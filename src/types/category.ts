import { Product } from "./product"

export interface ICategory {
    id: string
    name: string
    products: Product[]
}