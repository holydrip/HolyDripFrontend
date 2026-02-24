import { $api } from "@/api/axios";
import { Category } from "@/lib/types";

export const CategoryService = {
    async getAll() {
        const {data} = await $api.get<Category[]>('/category/')
        return data
    },

    async getCategoryById(id: string) {
        const {data} = await $api.get<Category>(`/category/${id}`)
        return data
    },
}