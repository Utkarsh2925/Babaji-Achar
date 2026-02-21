import { Product, Variant, CartItem, Order } from '../types';

// Helper to access the global dataLayer safely
const getDatalayer = () => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        return window.dataLayer;
    }
    return [];
};

export const AnalyticsService = {
    /**
     * Fire GA4 'view_item' event when a user opens a product modal
     */
    viewItem: (product: Product, variant: Variant) => {
        try {
            getDatalayer().push({ ecommerce: null }); // Clear previous ecommerce object
            getDatalayer().push({
                event: 'view_item',
                ecommerce: {
                    currency: 'INR',
                    value: variant.mrp,
                    items: [
                        {
                            item_id: product.id,
                            item_name: product.name.en,
                            item_category: product.category,
                            item_variant: variant.size,
                            price: variant.mrp,
                            quantity: 1
                        }
                    ]
                }
            });
            console.log('📊 GTM Event: view_item', product.name.en, variant.size);
        } catch (e) {
            console.error('Failed to log view_item event', e);
        }
    },

    /**
     * Fire GA4 'add_to_cart' event when a user clicks 'Add to Cart'
     */
    addToCart: (product: Product, variant: Variant, quantity: number) => {
        try {
            getDatalayer().push({ ecommerce: null });
            getDatalayer().push({
                event: 'add_to_cart',
                ecommerce: {
                    currency: 'INR',
                    value: variant.mrp * quantity,
                    items: [
                        {
                            item_id: product.id,
                            item_name: product.name.en,
                            item_category: product.category,
                            item_variant: variant.size,
                            price: variant.mrp,
                            quantity: quantity
                        }
                    ]
                }
            });
            console.log('📊 GTM Event: add_to_cart', product.name.en, quantity);
        } catch (e) {
            console.error('Failed to log add_to_cart event', e);
        }
    },

    /**
     * Fire GA4 'begin_checkout' event when a user opens the checkout modal or drawer
     */
    beginCheckout: (cart: CartItem[], totalAmount: number) => {
        try {
            getDatalayer().push({ ecommerce: null });
            getDatalayer().push({
                event: 'begin_checkout',
                ecommerce: {
                    currency: 'INR',
                    value: totalAmount,
                    items: cart.map(item => ({
                        item_id: item.productId,
                        item_name: item.productName,
                        item_variant: item.size,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            });
            console.log('📊 GTM Event: begin_checkout');
        } catch (e) {
            console.error('Failed to log begin_checkout event', e);
        }
    },

    /**
     * Fire GA4 'purchase' event when a user successfully completes an order
     */
    purchase: (order: Order) => {
        try {
            getDatalayer().push({ ecommerce: null });
            getDatalayer().push({
                event: 'purchase',
                ecommerce: {
                    transaction_id: order.id,
                    affiliation: 'Babaji Achar Online Store',
                    value: order.totalAmount,
                    currency: 'INR',
                    shipping: 0, // Calculate if applicable
                    items: order.items.map(item => ({
                        item_id: item.productId,
                        item_name: item.productName,
                        item_variant: item.size,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            });
            console.log('📊 GTM Event: purchase', order.id);
        } catch (e) {
            console.error('Failed to log purchase event', e);
        }
    }
};

// Add dataLayer to window interface
declare global {
    interface Window {
        dataLayer: any[];
    }
}
