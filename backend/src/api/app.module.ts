import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BotModule } from './bot/bot.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    BotModule,
    OrderModule,
    PaymentModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
    })
  ],
  providers: [PrismaService], 
})
export class AppModule {}
