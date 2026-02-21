import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase.config';
import type { Review } from '../types';

const REVIEWS_COLLECTION = 'reviews';

export const ReviewService = {
    /**
     * Upload photos to Firebase Storage and get their URLs
     */
    uploadPhotos: async (files: File[], productId: string): Promise<string[]> => {
        const uploadPromises = files.map(async (file) => {
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
            const storageRef = ref(storage, `reviews/${productId}/${fileName}`);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        });

        return Promise.all(uploadPromises);
    },

    /**
     * Submit a new review
     */
    addReview: async (reviewData: Omit<Review, 'id' | 'date'>, files?: File[]): Promise<Review> => {
        try {
            let photoUrls: string[] = [];

            // Upload photos if any
            if (files && files.length > 0) {
                photoUrls = await ReviewService.uploadPhotos(files, reviewData.productId);
            }

            const newReview = {
                ...reviewData,
                photos: photoUrls,
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(firestore, REVIEWS_COLLECTION), newReview);

            return {
                id: docRef.id,
                ...reviewData,
                photos: photoUrls,
                date: new Date().toISOString()
            };
        } catch (error) {
            console.error("Error adding review: ", error);
            throw new Error("Failed to submit review");
        }
    },

    /**
     * Get reviews for a specific product
     */
    getProductReviews: async (productId: string): Promise<Review[]> => {
        try {
            const q = query(
                collection(firestore, REVIEWS_COLLECTION),
                where('productId', '==', productId)
                // Cannot use orderBy with where on different fields without a compound index easily in the default setup, 
                // so we will sort client side for now to prevent index required errors
            );

            const querySnapshot = await getDocs(q);
            const reviews: Review[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                reviews.push({
                    id: doc.id,
                    userId: data.userId,
                    userName: data.userName,
                    rating: data.rating,
                    comment: data.comment,
                    photos: data.photos || [],
                    isVerifiedBuyer: data.isVerifiedBuyer || false,
                    productId: data.productId,
                    date: data.createdAt ? new Date(data.createdAt.toMillis()).toISOString() : new Date().toISOString()
                } as Review);
            });

            // Sort by latest first
            return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (error) {
            console.error("Error fetching reviews: ", error);
            return [];
        }
    }
};
