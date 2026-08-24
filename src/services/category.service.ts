import { $api } from "@/api/axios";
import { Category } from "@/lib/types";
import { client } from "@/sanity/lib/client";

export const CategoryService = {
    async getAll() {
        const query = `*[_type == "category"]{
            "id": _id,
            "name": title,
            "slug": slug.current
        }`;
        try {
            return await client.fetch(query);
        } catch (error) {
            console.error("Sanity Fetch Error (Category getAll):", error);
            return [];
        }
    },

    async getCategoryById(id: string) {
        const query = `*[_type == "category" && slug.current == $id][0]{
            "id": _id,
            "name": title,
            "slug": slug.current,
            "products": *[_type == "product" && references(^._id)]{
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
            return await client.fetch(query, { id });
        } catch (error) {
            console.error("Sanity Fetch Error (getCategoryById):", error);
            return null;
        }
    },
}