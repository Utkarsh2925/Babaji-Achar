import { ref, push, set, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.config';
import type { Review } from '../types';

const REVIEWS_PATH = 'reviews';

export const ReviewService = {
    /**
     * Upload photos to Firebase Storage and get their URLs
     */
    uploadPhotos: async (files: File[], productId: string): Promise<string[]> => {
        const uploadPromises = files.map(async (file) => {
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
            const sRef = storageRef(storage, `reviews/${productId}/${fileName}`);
            await uploadBytes(sRef, file);
            return await getDownloadURL(sRef);
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

            const newReviewRef = push(ref(db, REVIEWS_PATH));
            const id = newReviewRef.key!;

            const newReview = {
                ...reviewData,
                id,
                photos: photoUrls,
                createdAt: new Date().toISOString(),
                date: new Date().toISOString()
            };

            await set(newReviewRef, newReview);

            return newReview as Review;
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
            const reviewsSnap = await get(ref(db, REVIEWS_PATH));
            if (!reviewsSnap.exists()) return [];

            const reviews: Review[] = [];

            reviewsSnap.forEach((child) => {
                const data = child.val();
                if (data.productId === productId) {
                    reviews.push({
                        id: child.key,
                        userId: data.userId,
                        userName: data.userName,
                        rating: data.rating,
                        comment: data.comment,
                        photos: data.photos || [],
                        isVerifiedBuyer: data.isVerifiedBuyer || false,
                        productId: data.productId,
                        date: data.date || data.createdAt || new Date().toISOString()
                    } as Review);
                }
            });

            // Sort by latest first
            return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (error) {
            console.error("Error fetching reviews: ", error);
            return [];
        }
    }
};
