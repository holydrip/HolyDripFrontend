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

    async sendMessage(message: string, photoUrl?: string): Promise<void> {
        if (this.chatIds.length === 0) {
            this.logger.error('Telegram Chat IDs не найдены в .env!');
            return;
        }

        for (const chatId of this.chatIds) {
            try {
                if (photoUrl) {
                    await this.bot.telegram.sendPhoto(chatId, photoUrl, {
                        caption: message,
                        parse_mode: 'HTML',
                    });
                } else {
                    await this.bot.telegram.sendMessage(chatId, message, {
                        parse_mode: 'HTML',
                    });
                }
                this.logger.log(`Уведомление в Telegram успешно отправлено (chat: ${chatId})`);
            } catch (error) {
                this.logger.error(`Ошибка отправки в ТГ (chat: ${chatId})`, error);
            }
        }
    }
}
