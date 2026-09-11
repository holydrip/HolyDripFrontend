import { Module, Global, OnModuleInit, Logger } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotUpdate } from './bot.update';
import { PrismaService } from 'src/database/prisma.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Global()
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN') || '',
        launchOptions: false as any, // We'll launch manually with retry
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BotController],
  providers: [BotService, BotUpdate, PrismaService],
  exports: [BotService]
})
export class BotModule implements OnModuleInit {
  private readonly logger = new Logger(BotModule.name);

  constructor(@InjectBot() private readonly bot: Telegraf) {}

  async onModuleInit() {
    const maxRetries = 5;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.bot.telegram.deleteWebhook({ drop_pending_updates: true });
        this.bot.launch({ dropPendingUpdates: true });
        this.logger.log('Telegram bot launched successfully');
        return;
      } catch (error: any) {
        this.logger.warn(`Bot launch attempt ${attempt}/${maxRetries} failed: ${error.message}`);
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(r => setTimeout(r, attempt * 3000));
        } else {
          this.logger.error('Failed to launch Telegram bot after all retries. Server will continue without bot polling.');
        }
      }
    }
  }
}
