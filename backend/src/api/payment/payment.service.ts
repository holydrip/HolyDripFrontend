import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private readonly monoApiUrl = 'https://api.monobank.ua/api/merchant/invoice/create';
    private readonly monoToken = process.env.MONO_X_TOKEN;

    async createInvoice(orderId: string, amount: number, products: any[]) {
        if (!this.monoToken) {
            this.logger.warn('MONO_X_TOKEN is not set, returning dummy payment URL');
            return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?orderId=${orderId}`;
        }

        try {
            const response = await fetch(this.monoApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Token': this.monoToken
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // в копейках
                    ccy: 980, // UAH
                    merchantPaymInfo: {
                        reference: orderId,
                        destination: `Оплата заказа ${orderId}`,
                        basketOrder: products.map(p => ({
                            name: p.name,
                            qty: p.quantity,
                            sum: Math.round(p.price * 100) * p.quantity,
                            icon: p.image || '',
                            unit: 'шт.',
                        }))
                    },
                    redirectUrl: `${process.env.FRONTEND_URL}/checkout/success?orderId=${orderId}`,
                    webHookUrl: `${process.env.BACKEND_URL}/api/payment/webhook`,
                    validity: 3600 // 1 час на оплату
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            const data = await response.json();
            return data.pageUrl;
        } catch (error) {
            this.logger.error('Mono Pay Error:', error);
            throw new Error('Failed to create payment invoice');
        }
    }
}
