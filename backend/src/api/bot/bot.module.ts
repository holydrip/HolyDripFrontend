import { Module, Global } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotUpdate } from './bot.update';
import { PrismaService } from 'src/database/prisma.service';

@Global()
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN') || '',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BotController],
  providers: [BotService, BotUpdate, PrismaService],
  exports: [BotService]
})
export class BotModule {}
