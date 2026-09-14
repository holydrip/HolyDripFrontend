import { Injectable, Logger } from '@nestjs/common';
import { BotService } from '../bot/bot.service';
import { PrismaService } from 'src/database/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { CreateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        private readonly botService: BotService,
        private readonly prisma: PrismaService,
        private readonly paymentService: PaymentService
    ) {}

    async createOrder(dto: CreateOrderDto) {
        // 1. Create order in DB
        const order = await this.prisma.order.create({
            data: {
                name: dto.name,
                phone: dto.phone,
                telegram: dto.telegram,
                address: dto.address,
                totalPrice: dto.totalPrice,
                status: 'PENDING',
                items: {
                    create: dto.items.map(i => ({
                        productId: i.productId,
                        size: i.size,
                        quantity: i.quantity,
                        price: i.price,
                    }))
                }
            },
            include: { items: { include: { product: true } } }
        });

        // 2. Generate Payment Link
        let paymentUrl = '';
        try {
            paymentUrl = await this.paymentService.createInvoice(order.id, Number(order.totalPrice), dto.items);
        } catch (e) {
            this.logger.error('Failed to create payment invoice', e);
        }

        // 3. Send Telegram Notification immediately
        try {
            const itemsList = order.items.map(i => `▫️ <b>${i.product.name}</b>\n   Розмір: ${i.size} | К-сть: ${i.quantity} шт | Ціна: ${i.price} ₴`).join('\n');
            const firstProductImage = order.items[0]?.product?.images?.[0] || undefined;

            const message = `
🆕 <b>НОВЕ ЗАМОВЛЕННЯ!</b>

📦 <b>Номер:</b> #${order.id}

👤 <b>Клієнт:</b> ${order.name}
📱 <b>Телефон:</b> <code>${order.phone}</code>
💬 <b>Telegram:</b> ${order.telegram?.startsWith('@') ? order.telegram : '@' + order.telegram}
📍 <b>Доставка:</b> ${order.address || 'Не вказана'}

🛒 <b>Кошик:</b>
${itemsList || 'Пусто'}

💰 <b>Сума до оплати:</b> <b>${order.totalPrice} ₴</b>

<i>Очікує оплати або підтвердження!</i>`;

            await this.botService.sendMessage(message, firstProductImage);
        } catch (e) {
            this.logger.error('Failed to send Telegram notification', e);
        }

        return { 
            success: true, 
            message: 'Заказ успешно оформлен!', 
            orderId: order.id,
            paymentUrl 
        };
    }
}
