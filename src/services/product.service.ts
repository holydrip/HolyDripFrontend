import { $api } from "@/api/axios";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";

export const ProductService = {
    async getAll() {
        const {data} = await $api.get<Product[]>('/product/')
        return data
    },

    async getProductBySlug(slug: string) {
        const {data} = await $api.get<Product>(`/product/${slug}`)
        return data
    },

    async getProductsByCategoryId(id: string){
        const {data} = await $api.get<Product[]>(`/product/category/${id}`)
        return data;
    },

    async getRecommended() {
    const query = `*[_type == "recommentedProduct"][0]{
        title,
        "products": products[]->{
            "id": _id,
            "name": title,
            "slug": slug.current,
            price,
            "images": images[].secure_url,
            sizes,
            "categoryId": category->slug.current
        }
    }`;

        try {
            const data = await client.fetch(query);
            return data;
        } catch (error) {
            console.error("Sanity Fetch Error:", error);
            return null;
        }
    },

    async getNewCollection() {
        const query = `*[_type == "collectionProduct"][0]{
            title,
            "products": products[]->{
                "id": _id,
                "name": title,
                "slug": slug.current,
                price,
                "images": images[].secure_url,
                sizes,
                "categoryId": category->slug.current
            }
        }`;
        
        try {
            const data = await client.fetch(query);
            return data;
        } catch (error) {
            console.error("Sanity Fetch Error (Collection):", error);
            return null;
        }
    },

    async getSales() {
        const query = `*[_type == "salesBlock"][0]{
            sectionLabel,
            title,
            "products": products[]->{
                "id": _id,
                "name": title,
                "slug": slug.current,
                price,
                "images": images[].secure_url, 
                sizes,
                "categoryId": category->slug.current
            }
        }`;

        try {
            return await client.fetch(query);
        } catch (error) {
            console.error("Sanity Sales Error:", error);
            return null;
        }
    }
}