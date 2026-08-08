import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { BotModule } from '../bot/bot.module';
import { DatabaseModule } from 'src/database/database.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [BotModule, DatabaseModule, PaymentModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
