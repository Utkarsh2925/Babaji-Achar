import { ref, get, set, update } from 'firebase/database';
import { db } from '../firebase.config';
import type { Product, CartItem } from '../types';

const INVENTORY_PATH = 'inventory';

export const InventoryService = {
    /**
     * Sync local products array with real-time stock from RTDB
     */
    syncProductsWithInventory: async (localProducts: Product[]): Promise<Product[]> => {
        try {
            const inventorySnap = await get(ref(db, INVENTORY_PATH));

            if (!inventorySnap.exists()) {
                // If inventory is completely empty, we should run the seed automatically
                console.log("Empty inventory, seeding from constants...");
                await InventoryService.seedInventory(localProducts);
                return localProducts;
            }

            const inventoryMap = new Map<string, number>();
            inventorySnap.forEach(child => {
                // Doc ID is variantId, value has stock
                inventoryMap.set(child.key as string, child.val().stock);
            });

            // Merge stock back into products list
            return localProducts.map(product => {
                const updatedVariants = product.variants.map(variant => {
                    if (inventoryMap.has(variant.id)) {
                        return { ...variant, stock: inventoryMap.get(variant.id) as number };
                    }
                    return variant;
                });
                return { ...product, variants: updatedVariants };
            });
        } catch (error) {
            console.error("Error syncing inventory:", error);
            return localProducts; // Fallback to local stock
        }
    },

    /**
     * Seeds the RTDB inventory collection from constants.ts
     * Will overwrite existing stock. Use carefully.
     */
    seedInventory: async (localProducts: Product[]) => {
        try {
            const updates: Record<string, any> = {};

            localProducts.forEach(product => {
                product.variants.forEach(variant => {
                    updates[`${INVENTORY_PATH}/${variant.id}`] = {
                        productId: product.id,
                        size: variant.size,
                        stock: variant.stock
                    };
                });
            });

            await update(ref(db), updates);
            console.log("Firebase RTDB Inventory successfully seeded!");
        } catch (error) {
            console.error("Error seeding inventory:", error);
        }
    },

    /**
     * Decrements stock in RTDB when an order is placed
     */
    decrementStock: async (items: CartItem[]) => {
        try {
            const updates: Record<string, any> = {};

            for (const item of items) {
                const itemRef = ref(db, `${INVENTORY_PATH}/${item.variantId}`);
                const docSnap = await get(itemRef);

                if (docSnap.exists()) {
                    const currentStock = docSnap.val().stock;
                    const newStock = Math.max(0, currentStock - item.quantity); // Prevent negative stock
                    updates[`${INVENTORY_PATH}/${item.variantId}/stock`] = newStock;
                }
            }

            if (Object.keys(updates).length > 0) {
                await update(ref(db), updates);
                console.log("Stock successfully decremented for order.");
            }
        } catch (error) {
            console.error("Failed to decrement stock:", error);
        }
    }
};
