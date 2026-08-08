import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { BotService } from '../bot/bot.service';
import { UserService } from '../user/user.service';

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
        this.logger.log(`Received Monopay webhook: ${JSON.stringify(body)}`);
        
        if (!body.reference) return;

        const orderId = body.reference;
        const status = body.status; // 'success', 'created', 'failure'

        if (status === 'success') {
            const order = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'PAID' }
            });
            
            if (order.userId) {
                await this.userService.updateDiscount(order.userId);
            }
            
            this.botService.sendMessage(`✅ <b>Оплата получена!</b>\nЗаказ: ${orderId}\nСумма: ${body.amount / 100} UAH`);
        } else if (status === 'failure') {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'FAILED' }
            });
            this.botService.sendMessage(`❌ <b>Ошибка оплаты!</b>\nЗаказ: ${orderId}`);
        }

        return { message: 'Webhook received' };
    }
}
