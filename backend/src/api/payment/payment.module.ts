import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BotModule } from '../bot/bot.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, BotModule, UserModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
