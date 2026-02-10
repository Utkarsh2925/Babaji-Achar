// NotificationService.ts - Frontend client for communication bot
import type { Order } from '../types';

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3000';

export const NotificationService = {
    /**
     * Send order confirmation via WhatsApp
     */
    async sendOrderConfirmation(order: Order): Promise<void> {
        if (!order.marketingConsent?.whatsapp) {
            console.log('📵 WhatsApp consent not granted for order:', order.id);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/send-whatsapp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: order.customerDetails.phone,
                    templateName: 'order_confirmation',
                    parameters: {
                        name: order.customerDetails.fullName,
                        order_id: order.id,
                        amount: order.totalAmount,
                        address: `${order.customerDetails.street}, ${order.customerDetails.city}`
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`WhatsApp API error: ${response.status}`);
            }

            console.log('✅ Order confirmation sent via WhatsApp');
        } catch (error) {
            console.error('❌ Failed to send WhatsApp notification:', error);
            // Fail silently - don't block order flow
        }
    },

    /**
     * Send payment status update
     */
    async sendPaymentStatus(order: Order): Promise<void> {
        if (!order.marketingConsent?.whatsapp) return;

        const templateName = order.paymentMethod === 'COD'
            ? 'payment_cod'
            : 'payment_online';

        try {
            await fetch(`${API_BASE}/api/send-whatsapp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: order.customerDetails.phone,
                    templateName,
                    parameters: {
                        name: order.customerDetails.fullName,
                        order_id: order.id,
                        amount: order.totalAmount
                    }
                })
            });

            console.log('✅ Payment status sent via WhatsApp');
        } catch (error) {
            console.error('❌ Failed to send payment status:', error);
        }

        // Also send Email (Fire and Forget)
        if (order.marketingConsent?.email) {
            fetch(`${API_BASE}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: "mailbabajiachar@gmail.com", // Admin email (or customer email if collected)
                    type: 'order_confirmation',
                    subject: `Order Confirmation - ${order.id}`,
                    orderDetails: {
                        orderId: order.id,
                        customerName: order.customerDetails.fullName,
                        phone: order.customerDetails.phone,
                        address: order.customerDetails.street,
                        city: order.customerDetails.city,
                        pincode: order.customerDetails.pincode,
                        items: order.items,
                        totalAmount: order.totalAmount,
                        paymentMethod: order.paymentMethod
                    }
                })
            }).catch(e => console.error('Email trigger failed', e));
        }
    },

    /**
     * Send dispatch notification
     */
    async sendDispatchUpdate(order: Order): Promise<void> {
        if (!order.marketingConsent?.whatsapp) return;

        try {
            await fetch(`${API_BASE}/api/send-whatsapp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: order.customerDetails.phone,
                    templateName: 'order_dispatched',
                    parameters: {
                        name: order.customerDetails.fullName,
                        order_id: order.id
                    }
                })
            });

            console.log('✅ Dispatch notification sent');
        } catch (error) {
            console.error('❌ Failed to send dispatch notification:', error);
        }
    }
};
