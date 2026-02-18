import { $api } from "@/api/axios";
import { ICategory } from "@/types/category";

export const CategoryService = {
    async getAll() {
        const {data} = await $api.get<ICategory[]>('/category/')
        return data
    },

    async getCategoryById(id: number) {
        const {data} = await $api.get<ICategory>(`/category/${id}`)
        return data
    },
}