import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private readonly wayforpayApiUrl = 'https://api.wayforpay.com/api';
    private readonly wfpAccount = process.env.WAYFORPAY_ACCOUNT || 'holydrip_com_ua1';
    private readonly wfpSecret = process.env.WAYFORPAY_SECRET_KEY || '2c28b4baa8b0e760dec157fb5a553012fc78954f';

    async createInvoice(orderId: string, amount: number, products: any[]) {
        try {
            const orderDate = Math.floor(Date.now() / 1000);
            const frontendUrl = (process.env.FRONTEND_URL || 'https://holydrip.com.ua').replace(/\/+$/, '');
            const backendUrl = (process.env.BACKEND_URL || 'https://holydripbackend-production.up.railway.app').replace(/\/+$/, '');

            let domainName = 'holydrip.com.ua';
            try {
                const urlObj = new URL(frontendUrl.startsWith('http') ? frontendUrl : `https://${frontendUrl}`);
                domainName = urlObj.hostname || 'holydrip.com.ua';
            } catch (e) {
                domainName = 'holydrip.com.ua';
            }

            const currency = 'UAH';

            const productNames = products.map(p => p.name || 'Товар');
            const productCounts = products.map(p => Number(p.quantity) || 1);
            const productPrices = products.map(p => Number(p.price) || 0);

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
                serviceUrl: `${backendUrl}/api/payment/webhook`,
                returnUrl: `${frontendUrl}/checkout/success?orderId=${orderId}`,
                orderReference: orderId,
                orderDate: orderDate,
                amount: amount,
                currency: currency,
                productName: productNames,
                productPrice: productPrices,
                productCount: productCounts,
            };

            this.logger.log(`Calling WayForPay invoice API for order ${orderId}...`);

            const response = await axios.post(this.wayforpayApiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            const data = response.data;
            if (data.reasonCode !== 1100) {
                this.logger.error(`WayForPay error [${data.reasonCode}]: ${data.reason}`);
                throw new Error(data.reason || 'Failed to create WayForPay invoice');
            }
            this.logger.log(`WayForPay invoice created successfully: ${data.invoiceUrl}`);
            return data.invoiceUrl;
        } catch (error: any) {
            this.logger.error('WayForPay Error:', error?.response?.data || error.message || error);
            throw new Error('Failed to create payment invoice');
        }
    }
}
