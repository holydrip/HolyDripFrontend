import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { BotService } from '../bot/bot.service';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';

@Controller('payment')
export class PaymentController {
    private readonly logger = new Logger(PaymentController.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly botService: BotService,
        private readonly userService: UserService
    ) {}

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleWebhook(@Body() body: any) {
        this.logger.log(`Received WayForPay webhook: ${JSON.stringify(body)}`);
        
        const orderId = body.orderReference;
        if (!orderId) return { message: 'Invalid payload' };

        const status = body.transactionStatus; // 'Approved', 'Declined', etc.

        if (status === 'Approved') {
            const order = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'PAID' }
            });
            
            if (order.userId) {
                await this.userService.updateDiscount(order.userId);
            }
            
            this.botService.sendMessage(`✅ <b>Оплата получена!</b>\nЗаказ: ${orderId}\nСумма: ${body.amount} UAH`);
        } else if (status === 'Declined' || status === 'Expired') {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'FAILED' }
            });
            this.botService.sendMessage(`❌ <b>Ошибка оплаты (WayForPay)!</b>\nЗаказ: ${orderId}\nПричина: ${body.reason || 'Неизвестно'}`);
        }

        const time = Math.floor(Date.now() / 1000);
        const secret = process.env.WAYFORPAY_SECRET_KEY || '';
        const signature = crypto.createHmac('md5', secret)
            .update(`${orderId};accept;${time}`)
            .digest('hex');

        return {
            orderReference: orderId,
            status: "accept",
            time: time,
            signature: signature
        };
    }
}
