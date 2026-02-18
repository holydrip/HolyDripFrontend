import { $api } from "@/api/axios";
import { Product } from "@/lib/types";

export const ProductService = {
    async getAll() {
            const {data} = await $api.get<Product[]>('/product/')
            return data
        },
    
        async getProductById(id: number) {
            const {data} = await $api.get<Product>(`/product/${id}`)
            return data
        },
}