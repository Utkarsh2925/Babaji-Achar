import { db } from '../firebase.config';
import { ref, push, set, onValue, update, remove, query, orderByChild } from 'firebase/database';
import type { Order } from '../types';

export const OrderService = {
    // Create a new order in Firebase
    createOrder: async (order: Order): Promise<string> => {
        try {
            const ordersRef = ref(db, 'orders');
            const newOrderRef = push(ordersRef);

            await set(newOrderRef, {
                ...order,
                firebaseId: newOrderRef.key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            console.log('Order saved to Firebase:', newOrderRef.key);
            return newOrderRef.key!;
        } catch (error) {
            console.error('Error creating order in Firebase:', error);
            throw error;
        }
    },

    // Subscribe to all orders (real-time)
    subscribeToOrders: (callback: (orders: Order[]) => void, onError?: (error: Error) => void) => {
        const ordersRef = ref(db, 'orders');
        const ordersQuery = query(ordersRef, orderByChild('createdAt'));

        return onValue(ordersQuery, (snapshot) => {
            const ordersData: Order[] = [];
            snapshot.forEach((childSnapshot) => {
                const order = childSnapshot.val();
                ordersData.push({
                    ...order,
                    firebaseId: childSnapshot.key
                });
            });

            // Sort by date descending (newest first)
            ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            console.log('Orders loaded from Firebase:', ordersData.length);
            callback(ordersData);
        }, (error) => {
            console.error('Error loading orders from Firebase:', error);
            if (onError) onError(error);
            callback([]);
        });
    },

    // Update order status
    updateOrderStatus: async (firebaseId: string, status: string): Promise<void> => {
        try {
            const orderRef = ref(db, `orders/${firebaseId}`);
            await update(orderRef, {
                status,
                updatedAt: new Date().toISOString()
            });
            console.log('Order status updated:', firebaseId, status);
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // Delete an order
    deleteOrder: async (firebaseId: string): Promise<void> => {
        try {
            const orderRef = ref(db, `orders/${firebaseId}`);
            await remove(orderRef);
            console.log('Order deleted:', firebaseId);
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    },

    // Get orders by phone number (for checking if user is new)
    getOrdersByPhone: async (phone: string): Promise<Order[]> => {
        return new Promise((resolve) => {
            const ordersRef = ref(db, 'orders');
            onValue(ordersRef, (snapshot) => {
                const orders: Order[] = [];
                snapshot.forEach((childSnapshot) => {
                    const order = childSnapshot.val();
                    if (order.customerDetails?.phone === phone) {
                        orders.push(order);
                    }
                });
                resolve(orders);
            }, { onlyOnce: true });
        });
    }
};
