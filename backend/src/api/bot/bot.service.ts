import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService {
    private readonly logger = new Logger(BotService.name);
    private readonly chatIds: string[];

    constructor(
        @InjectBot() private readonly bot: Telegraf,
        private readonly configService: ConfigService
    ) {
        const ids = this.configService.get<string>('TELEGRAM_ADMIN_CHAT_ID') || '';
        this.chatIds = ids.split(',').map(id => id.trim()).filter(id => id);
    }

    getOrderKeyboard(orderId: string, currentStatus?: string) {
        return {
            inline_keyboard: [
                [
                    { text: currentStatus === 'CONFIRMED' ? '• Підтверджено •' : '✅ Підтвердити', callback_data: `status:${orderId}:CONFIRMED` },
                    { text: currentStatus === 'SHIPPED' ? '• Відправлено •' : '🚚 Відправлено', callback_data: `status:${orderId}:SHIPPED` }
                ],
                [
                    { text: currentStatus === 'FAILED' ? '• Скасовано •' : '❌ Скасувати', callback_data: `status:${orderId}:FAILED` }
                ]
            ]
        };
    }

    async sendMessage(message: string, photoUrl?: string, replyMarkup?: any): Promise<void> {
        if (this.chatIds.length === 0) {
            this.logger.error('Telegram Chat IDs не знайдено в .env!');
            return;
        }

        for (const chatId of this.chatIds) {
            try {
                const extra: any = {
                    parse_mode: 'HTML',
                };
                if (replyMarkup) {
                    extra.reply_markup = replyMarkup;
                }

                if (photoUrl) {
                    await this.bot.telegram.sendPhoto(chatId, photoUrl, {
                        ...extra,
                        caption: message,
                    });
                } else {
                    await this.bot.telegram.sendMessage(chatId, message, extra);
                }
                this.logger.log(`Уведомлення в Telegram успішно надіслано (chat: ${chatId})`);
            } catch (error) {
                this.logger.error(`Помилка відправки в ТГ (chat: ${chatId})`, error);
            }
        }
    }
}
