import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

        // 2. Resolve userId
        let resolvedUserId = dto.userId;
        if (!resolvedUserId && dto.phone) {
            const cleanPhone = dto.phone.replace(/\D/g, '');
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { phone: dto.phone },
                        { phone: { contains: cleanPhone.slice(-9) } }
                    ]
                }
            });
            if (existingUser) {
                resolvedUserId = existingUser.id;
            }
        }

        // 3. Create order in DB
        const order = await this.prisma.order.create({
            data: {
                userId: resolvedUserId,
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

        // 4. Generate Payment Link
        let paymentUrl = '';
        try {
            paymentUrl = await this.paymentService.createInvoice(order.id, Number(order.totalPrice), dto.items);
        } catch (e) {
            this.logger.error('Failed to create payment invoice', e);
        }

        // 5. Send Telegram Notification immediately with action buttons
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

            const keyboard = this.botService.getOrderKeyboard(order.id, 'PENDING');
            await this.botService.sendMessage(message, firstProductImage, keyboard);
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

    async getAllOrders() {
        return this.prisma.order.findMany({
            include: {
                items: {
                    include: { product: true }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getOrderById(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        });
        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }
        return order;
    }

    async updateOrderStatus(id: string, status: any) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }

        const updated = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: { product: true }
                },
                user: true
            }
        });

        try {
            const statusLabels: Record<string, string> = {
                CONFIRMED: '✅ Підтверджено',
                SHIPPED: '🚚 Відправлено',
                FAILED: '❌ Скасовано',
                PAID: '💰 Оплачено',
                PENDING: '⏳ Очікує оплати'
            };
            const label = statusLabels[status] || status;
            await this.botService.sendMessage(
                `🔔 <b>Статус замовлення #${order.id} змінено в CRM!</b>\n\nНовий статус: <b>${label}</b>\nКлієнт: ${order.name} (${order.phone})`
            );
        } catch (err) {
            this.logger.error('Failed to send status update message to Telegram', err);
        }

        return updated;
    }
}
