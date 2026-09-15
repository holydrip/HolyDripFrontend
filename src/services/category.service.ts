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
            return await client.fetch<Category[]>(query);
        } catch (error) {
            console.error("Sanity Fetch Error (Category getAll):", error);
            return [];
        }
    },

    async getCategoryById(id: string) {
        const query = `*[_type == "category" && (_id == $id || slug.current == $id || lower(title) == lower($id) || lower(slug.current) == lower($id))][0]{
            "id": _id,
            "name": title,
            "slug": slug.current,
            "products": *[_type == "product" && (
                category._ref == ^._id || 
                references(^._id) || 
                category->slug.current == ^.slug.current || 
                lower(category->title) == lower(^.title) ||
                lower(title) match lower(^.title) || 
                lower(title) match lower(^.slug.current)
            )]{
                "id": _id,
                "name": title,
                "slug": slug.current,
                price,
                "images": images[]{ "url": coalesce(secure_url, asset->url) }.url,
                sizes,
                description,
                "measurements": measurements[]{ size, details },
                "categoryId": category->slug.current
            }
        }`;
        try {
            const data = await client.fetch<Category | null>(query, { id });
            if (data) return data;

            // Fallback for tags or non-standard category slugs/titles
            const fallbackQuery = `*[_type == "product" && (
                category._ref == $id || 
                references($id) || 
                lower(category->title) match lower($id) || 
                lower(category->slug.current) == lower($id) || 
                lower(title) match lower($id)
            )]{
                "id": _id,
                "name": title,
                "slug": slug.current,
                price,
                "images": images[]{ "url": coalesce(secure_url, asset->url) }.url,
                sizes,
                description,
                "measurements": measurements[]{ size, details },
                "categoryId": category->slug.current
            }`;
            const fallbackProducts = await client.fetch<any[]>(fallbackQuery, { id });
            if (fallbackProducts && fallbackProducts.length > 0) {
                return {
                    id,
                    name: id.toUpperCase(),
                    slug: id,
                    products: fallbackProducts
                } as Category;
            }

            return null;
        } catch (error) {
            console.error("Sanity Fetch Error (getCategoryById):", error);
            return null;
        }
    },
}