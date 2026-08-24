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
            include: { items: true }
        });

        // 2. Generate Payment Link
        let paymentUrl = '';
        if (dto.paymentMethod !== 'cod') {
            try {
                paymentUrl = await this.paymentService.createInvoice(order.id, Number(order.totalPrice), dto.items);
            } catch (e) {
                this.logger.error('Failed to create payment invoice', e);
            }
        }

        // 3. Send Telegram Notification
        const message = `
            <b>НОВЫЙ ЗАКАЗ В HOLY DRIP</b>
            <b>Имя:</b> ${dto.name}
            <b>Телефон:</b> <code>${dto.phone}</code>
            <b>Телеграм:</b> <code>${dto.telegram}</code>
            <b>Адреса:</b> ${dto.address || 'Не вказана'}
            <b>Товары:</b>
            ${dto.items.map(i => `- ${i.name} (${i.size}) x${i.quantity}`).join('\n') || 'Пусто'}
            <b>Сумма:</b> ${dto.totalPrice} UAH
            <b>Оплата:</b> ${dto.paymentMethod === 'cod' ? 'Накладений платіж (При отриманні)' : 'Ожидает (Mono Pay)'}
            <b>ID Заказа:</b> <code>${order.id}</code>
        `;

        // Find the first image of the first product to send
        const firstProductImage = dto.items[0]?.image;

        this.botService.sendMessage(message, firstProductImage);

        return { 
            success: true, 
            message: 'Заказ успешно оформлен!', 
            orderId: order.id,
            paymentUrl 
        };
    }
}
