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
                data: { status: 'PAID' },
                include: { items: { include: { product: true } } }
            });
            
            if (order.userId) {
                await this.userService.updateDiscount(order.userId);
            }
            
            const itemsList = order.items.map(i => `▫️ <b>${i.product.name}</b>\n   Розмір: ${i.size} | К-сть: ${i.quantity} шт | Ціна: ${i.price} ₴`).join('\n');
            const firstProductImage = order.items[0]?.product?.images?.[0] || undefined;

            const message = `
✅ <b>ОПЛАТА УСПІШНА! (WayForPay)</b>

📦 <b>ЗАМОВЛЕННЯ #${order.id}</b>

👤 <b>Клієнт:</b> ${order.name}
📱 <b>Телефон:</b> <code>${order.phone}</code>
💬 <b>Telegram:</b> ${order.telegram?.startsWith('@') ? order.telegram : '@' + order.telegram}
📍 <b>Доставка:</b> ${order.address || 'Не вказана'}

🛒 <b>Кошик:</b>
${itemsList || 'Пусто'}

💰 <b>Оплачена сума:</b> <b>${order.totalPrice} ₴</b>

<i>Можете відправляти товар клієнту!</i>`;

            this.botService.sendMessage(message, firstProductImage);
        } else if (status === 'Declined' || status === 'Expired') {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'FAILED' }
            });
            this.botService.sendMessage(`❌ <b>ПОМИЛКА ОПЛАТИ (WayForPay)!</b>\n\n📦 <b>Замовлення:</b> #${orderId}\n⚠️ <b>Причина:</b> ${body.reason || 'Невідомо'}`);
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
