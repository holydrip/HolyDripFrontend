import { $api } from "@/api/axios"
import { ITelegramBot } from "@/lib/types"

export const TelegramService = {
    async order(body: ITelegramBot) {
        const {data} = await $api.post('/order/', body)
        return data
    }
}