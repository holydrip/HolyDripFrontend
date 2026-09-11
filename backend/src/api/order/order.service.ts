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
        try {
            paymentUrl = await this.paymentService.createInvoice(order.id, Number(order.totalPrice), dto.items);
        } catch (e) {
            this.logger.error('Failed to create payment invoice', e);
        }

        // We intentionally do NOT send a Telegram notification here anymore.
        // It will be sent via the WayForPay webhook ONLY when the payment is successful (status === 'Approved').
        // This prevents spam from abandoned carts.

        return { 
            success: true, 
            message: 'Заказ успешно оформлен!', 
            orderId: order.id,
            paymentUrl 
        };
    }
}
