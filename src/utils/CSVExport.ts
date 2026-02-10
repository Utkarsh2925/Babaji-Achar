// CSVExport.ts - Utility for exporting data to CSV files

import type { Order, Product, Store } from '../types';

export const CSVExport = {
    /**
     * Export orders to CSV
     */
    exportOrders: (orders: Order[], filename?: string) => {
        const headers = [
            'Order ID',
            'Date',
            'Customer Name',
            'Phone',
            'Email',
            'Address',
            'City',
            'Pincode',
            'Items',
            'Total Amount',
            'Payment Method',
            'Payment Status',
            'Order Status',
            'UTR Number',
            'Razorpay Order ID',
            'Razorpay Payment ID',
            'WhatsApp Consent',
            'Email Consent'
        ];

        const rows = orders.map(order => [
            order.id,
            new Date(order.date).toLocaleString(),
            order.customerDetails.fullName,
            order.customerDetails.phone,
            order.customerDetails.email || 'N/A',
            order.customerDetails.street,
            order.customerDetails.city,
            order.customerDetails.pincode,
            order.items.map(item => `${item.productName} (${item.size}) x${item.quantity}`).join('; '),
            order.totalAmount,
            order.paymentMethod,
            order.paymentStatus,
            order.status,
            order.utrNumber || 'N/A',
            order.razorpayOrderId || 'N/A',
            order.razorpayPaymentId || 'N/A',
            order.marketingConsent?.whatsapp ? 'Yes' : 'No',
            order.marketingConsent?.email ? 'Yes' : 'No'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        downloadCSV(csvContent, filename || `orders_${new Date().toISOString().split('T')[0]}.csv`);
    },

    /**
     * Export products to CSV
     */
    exportProducts: (products: Product[], filename?: string) => {
        const headers = [
            'Product ID',
            'Name (EN)',
            'Name (HI)',
            'Description (EN)',
            'Description (HI)',
            'Category',
            'Variant Size',
            'Variant MRP',
            'Variant Stock',
            'Main Image',
            'Ingredients'
        ];

        const rows: string[][] = [];
        products.forEach(product => {
            product.variants.forEach(variant => {
                rows.push([
                    product.id,
                    product.name.en,
                    product.name.hi,
                    product.description.en,
                    product.description.hi,
                    product.category,
                    variant.size,
                    variant.mrp.toString(),
                    variant.stock.toString(),
                    product.mainImage,
                    product.ingredients.join('; ')
                ]);
            });
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        downloadCSV(csvContent, filename || `products_${new Date().toISOString().split('T')[0]}.csv`);
    },

    /**
     * Export stores to CSV
     */
    exportStores: (stores: Store[], filename?: string) => {
        const headers = [
            'Store ID',
            'Name',
            'Address',
            'City',
            'Pincode',
            'Phone',
            'Latitude',
            'Longitude',
            'Opening Hours'
        ];

        const rows = stores.map(store => [
            store.id,
            store.name,
            store.address,
            store.city,
            store.pincode,
            store.phone || 'N/A',
            store.lat?.toString() || 'N/A',
            store.lng?.toString() || 'N/A',
            store.hours || 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        downloadCSV(csvContent, filename || `stores_${new Date().toISOString().split('T')[0]}.csv`);
    },

    /**
     * Export all data (combined)
     */
    exportAll: (orders: Order[], products: Product[], stores: Store[]) => {
        const timestamp = new Date().toISOString().split('T')[0];
        CSVExport.exportOrders(orders, `orders_${timestamp}.csv`);
        CSVExport.exportProducts(products, `products_${timestamp}.csv`);
        CSVExport.exportStores(stores, `stores_${timestamp}.csv`);
    }
};

/**
 * Helper function to trigger CSV download
 */
function downloadCSV(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`✅ CSV exported: ${filename}`);
    } else {
        console.error('❌ CSV download not supported in this browser');
    }
}
