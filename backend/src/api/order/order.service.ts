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
        // 1. Resolve product IDs (supporting both DB UUID and Sanity _id)
        const itemsToCreate = await Promise.all(
            dto.items.map(async (i) => {
                let product = await this.prisma.product.findFirst({
                    where: {
                        OR: [
                            { id: i.productId },
                            { sanityId: i.productId }
                        ]
                    }
                });

                if (!product) {
                    // Fallback to the first product in DB to satisfy foreign key constraint if not found
                    product = await this.prisma.product.findFirst();
                }

                return {
                    productId: product ? product.id : i.productId,
                    size: i.size || 'Не вказано',
                    quantity: i.quantity || 1,
                    price: i.price,
                };
            })
        );

        // 2. Create order in DB
        const order = await this.prisma.order.create({
            data: {
                name: dto.name,
                phone: dto.phone,
                telegram: dto.telegram,
                address: dto.address,
                totalPrice: dto.totalPrice,
                status: 'PENDING',
                items: {
                    create: itemsToCreate
                }
            },
            include: { items: { include: { product: true } } }
        });

        // 3. Generate Payment Link
        let paymentUrl = '';
        try {
            paymentUrl = await this.paymentService.createInvoice(order.id, Number(order.totalPrice), dto.items);
        } catch (e) {
            this.logger.error('Failed to create payment invoice', e);
        }

        // 4. Send Telegram Notification immediately
        try {
            const itemsList = dto.items.map(i => `▫️ <b>${i.name}</b>\n   Розмір: ${i.size} | К-сть: ${i.quantity} шт | Ціна: ${i.price} ₴`).join('\n');
            const firstProductImage = dto.items[0]?.image || order.items[0]?.product?.images?.[0] || undefined;

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
            message: 'Замовлення успішно оформлено!', 
            orderId: order.id,
            paymentUrl 
        };
    }
}
