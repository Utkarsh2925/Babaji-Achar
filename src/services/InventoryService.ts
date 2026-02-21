import { collection, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { firestore } from '../firebase.config';
import type { Product, CartItem } from '../types';

const INVENTORY_COLLECTION = 'inventory';

export const InventoryService = {
    /**
     * Sync local products array with real-time stock from Firestore
     */
    syncProductsWithInventory: async (localProducts: Product[]): Promise<Product[]> => {
        try {
            const querySnapshot = await getDocs(collection(firestore, INVENTORY_COLLECTION));
            if (querySnapshot.empty) {
                // If inventory is completely empty, we should run the seed automatically
                console.log("Empty inventory, seeding from constants...");
                await InventoryService.seedInventory(localProducts);
                return localProducts;
            }

            const inventoryMap = new Map<string, number>();
            querySnapshot.forEach(doc => {
                // Doc ID is variantId, value has stock
                inventoryMap.set(doc.id, doc.data().stock);
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
     * Seeds the Firestore inventory collection from constants.ts
     * Will overwrite existing stock. Use carefully.
     */
    seedInventory: async (localProducts: Product[]) => {
        try {
            const batch = writeBatch(firestore);

            localProducts.forEach(product => {
                product.variants.forEach(variant => {
                    const docRef = doc(firestore, INVENTORY_COLLECTION, variant.id);
                    batch.set(docRef, {
                        productId: product.id,
                        size: variant.size,
                        stock: variant.stock
                    });
                });
            });

            await batch.commit();
            console.log("Firebase Inventory successfully seeded!");
        } catch (error) {
            console.error("Error seeding inventory:", error);
        }
    },

    /**
     * Decrements stock in Firestore when an order is placed
     */
    decrementStock: async (items: CartItem[]) => {
        try {
            const batch = writeBatch(firestore);

            for (const item of items) {
                const docRef = doc(firestore, INVENTORY_COLLECTION, item.variantId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const currentStock = docSnap.data().stock;
                    const newStock = Math.max(0, currentStock - item.quantity); // Prevent negative stock
                    batch.update(docRef, { stock: newStock });
                }
            }

            await batch.commit();
            console.log("Stock successfully decremented for order.");
        } catch (error) {
            console.error("Failed to decrement stock:", error);
        }
    }
};
