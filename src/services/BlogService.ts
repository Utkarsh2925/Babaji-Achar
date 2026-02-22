import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../firebase.config';
import type { BlogPost } from '../types';

const BLOGS_COLLECTION = 'blogs';

export const BlogService = {
    /**
     * Upload an article cover image to Firebase Storage
     */
    uploadFeaturedImage: async (file: File, slug: string): Promise<string> => {
        try {
            const fileName = `${Date.now()}_${slug}_${file.name}`;
            const storageRef = ref(storage, `blogs/${fileName}`);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("Error uploading featured image:", error);
            throw new Error("Failed to upload image");
        }
    },

    /**
     * Delete an image from storage
     */
    deleteImage: async (url: string) => {
        if (!url || !url.includes('firebase')) return;
        try {
            const imageRef = ref(storage, url);
            await deleteObject(imageRef);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    },

    /**
     * Create a new blog post
     */
    createPost: async (postData: Omit<BlogPost, 'id' | 'publishedDate'>, coverImage?: File): Promise<BlogPost> => {
        try {
            let featuredImageUrl = postData.featuredImage;

            if (coverImage) {
                featuredImageUrl = await BlogService.uploadFeaturedImage(coverImage, postData.slug);
            }

            const newPost = {
                ...postData,
                featuredImage: featuredImageUrl,
                publishedDate: new Date().toISOString(),
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(firestore, BLOGS_COLLECTION), newPost);

            return {
                id: docRef.id,
                ...newPost
            };
        } catch (error) {
            console.error("Error creating blog post:", error);
            throw new Error("Failed to create blog post");
        }
    },

    /**
     * Update an existing blog post
     */
    updatePost: async (id: string, updates: Partial<BlogPost>, newCoverImage?: File): Promise<void> => {
        try {
            const postRef = doc(firestore, BLOGS_COLLECTION, id);
            let updatedData = { ...updates, updatedAt: serverTimestamp() };

            if (newCoverImage && updates.slug) {
                // If there's an existing image, delete it first
                const existingPost = await getDoc(postRef);
                if (existingPost.exists() && existingPost.data().featuredImage) {
                    await BlogService.deleteImage(existingPost.data().featuredImage);
                }

                const newImageUrl = await BlogService.uploadFeaturedImage(newCoverImage, updates.slug);
                updatedData.featuredImage = newImageUrl;
            }

            await updateDoc(postRef, updatedData);
        } catch (error) {
            console.error("Error updating blog post:", error);
            throw new Error("Failed to update blog post");
        }
    },

    /**
     * Delete a blog post and its associated image
     */
    deletePost: async (id: string, imageUrl?: string): Promise<void> => {
        try {
            if (imageUrl) {
                await BlogService.deleteImage(imageUrl);
            }
            await deleteDoc(doc(firestore, BLOGS_COLLECTION, id));
        } catch (error) {
            console.error("Error deleting blog post:", error);
            throw new Error("Failed to delete blog post");
        }
    },

    /**
     * Get all posts (for Admin UI)
     */
    getAllPosts: async (): Promise<BlogPost[]> => {
        try {
            const q = query(collection(firestore, BLOGS_COLLECTION), orderBy('publishedDate', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BlogPost));
        } catch (error) {
            console.error("Error fetching all posts:", error);
            return [];
        }
    },

    /**
     * Get only published posts (for Frontend UI)
     */
    getPublishedPosts: async (): Promise<BlogPost[]> => {
        try {
            const q = query(
                collection(firestore, BLOGS_COLLECTION),
                where('isPublished', '==', true)
                // orderBy affects where clauses with different fields, skipping orderBy to prevent index errors for now, sorting locally
            );
            const querySnapshot = await getDocs(q);

            const posts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BlogPost));

            // Sort locally to avoid needing immediate compound index creation in Firebase
            return posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        } catch (error) {
            console.error("Error fetching published posts:", error);
            return [];
        }
    },

    /**
     * Get a single post by its URL slug
     */
    getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
        if (!slug) return null;
        try {
            const q = query(
                collection(firestore, BLOGS_COLLECTION),
                where('slug', '==', slug)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) return null;

            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            } as BlogPost;
        } catch (error) {
            console.error("Error fetching post by slug:", error);
            return null;
        }
    }
};
