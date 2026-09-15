import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private readonly wayforpayApiUrl = 'https://api.wayforpay.com/api';
    private readonly wfpAccount = process.env.WAYFORPAY_ACCOUNT;
    private readonly wfpSecret = process.env.WAYFORPAY_SECRET_KEY;

    async createInvoice(orderId: string, amount: number, products: any[]) {
        if (!this.wfpAccount || !this.wfpSecret) {
            this.logger.warn('WayForPay credentials not set, returning dummy payment URL');
            return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?orderId=${orderId}`;
        }

        try {
            const orderDate = Math.floor(Date.now() / 1000);
            const domainName = process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).hostname : 'holydrip.com.ua';
            const currency = 'UAH';

            const productNames = products.map(p => p.name);
            const productCounts = products.map(p => p.quantity);
            const productPrices = products.map(p => p.price);

            const stringToSign = [
                this.wfpAccount,
                domainName,
                orderId,
                orderDate,
                amount,
                currency,
                ...productNames,
                ...productCounts,
                ...productPrices
            ].join(';');

            const signature = crypto.createHmac('md5', this.wfpSecret).update(stringToSign).digest('hex');

            const payload = {
                transactionType: 'CREATE_INVOICE',
                merchantAccount: this.wfpAccount,
                merchantAuthType: 'SimpleSignature',
                merchantDomainName: domainName,
                merchantSignature: signature,
                apiVersion: 1,
                language: 'UA',
                serviceUrl: `${process.env.BACKEND_URL}/api/payment/webhook`,
                returnUrl: `${process.env.FRONTEND_URL}/checkout/success?orderId=${orderId}`,
                orderReference: orderId,
                orderDate: orderDate,
                amount: amount,
                currency: currency,
                productName: productNames,
                productPrice: productPrices,
                productCount: productCounts,
            };

            const response = await axios.post(this.wayforpayApiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = response.data;
            if (data.reasonCode !== 1100) {
                throw new Error(data.reason || 'Failed to create WayForPay invoice');
            }
            return data.invoiceUrl;
        } catch (error) {
            this.logger.error('WayForPay Error:', error);
            throw new Error('Failed to create payment invoice');
        }
    }
}
