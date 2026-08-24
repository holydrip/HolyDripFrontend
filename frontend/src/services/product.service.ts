import { $api } from "@/api/axios";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";

export const ProductService = {
    async getAll() {
        const query = `*[_type == "product"]{
            "id": _id,
            "name": title,
            "slug": slug.current,
            price,
            "images": images[].secure_url,
            sizes,
            description,
            "measurements": measurements[]{ size, details },
            "categoryId": category->slug.current
        }`;
        try {
            return await client.fetch(query);
        } catch (error) {
            console.error("Sanity Fetch Error (Product getAll):", error);
            return [];
        }
    },

    async getProductBySlug(slug: string) {
        const query = `*[_type == "product" && slug.current == $slug][0]{
            "id": _id,
            "name": title,
            "slug": slug.current,
            price,
            "images": images[].secure_url,
            sizes,
            description,
            "measurements": measurements[]{ size, details },
            "categoryId": category->slug.current
        }`;
        try {
            return await client.fetch(query, { slug });
        } catch (error) {
            console.error("Sanity Fetch Error (getProductBySlug):", error);
            return null;
        }
    },

    async getProductsByCategoryId(id: string) {
        const query = `*[_type == "product" && references($id)]{
            "id": _id,
            "name": title,
            "slug": slug.current,
            price,
            "images": images[].secure_url,
            sizes,
            description,
            "measurements": measurements[]{ size, details },
            "categoryId": category->slug.current
        }`;
        try {
            return await client.fetch(query, { id });
        } catch (error) {
            console.error("Sanity Fetch Error (getProductsByCategoryId):", error);
            return [];
        }
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