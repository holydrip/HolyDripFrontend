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
    // Start the bot asynchronously so it doesn't block NestJS startup
    this.startBotWithRetry();
  }

  private async startBotWithRetry() {
    let isRunning = false;

    const launchBot = async () => {
      try {
        await this.bot.telegram.deleteWebhook({ drop_pending_updates: true });
        
        this.logger.log('Attempting to launch Telegram bot...');
        // bot.launch() resolves only when the bot stops or crashes
        await this.bot.launch({ dropPendingUpdates: true });
        
        this.logger.warn('Telegram bot stopped gracefully.');
      } catch (error: any) {
        this.logger.error(`Telegram bot crashed: ${error.message}`);
        
        // Wait 5 seconds before trying again to avoid spamming Telegram API
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Retry launch
        launchBot();
      }
    };

    launchBot();
  }
}
