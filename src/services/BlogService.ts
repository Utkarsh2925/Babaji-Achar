import { ref, push, set, get, update, remove } from 'firebase/database';
import { db } from '../firebase.config';
import type { BlogPost } from '../types';
import { compressImageToBase64 } from '../utils/imageUtils';

const BLOGS_PATH = 'blogs';

export const BlogService = {
    /**
     * Create a new blog post
     */
    createPost: async (postData: Omit<BlogPost, 'id' | 'publishedDate'>, coverImage?: File): Promise<BlogPost> => {
        try {
            console.log("🔥 [BlogService] Starting createPost...");
            let featuredImageUrl = postData.featuredImage;

            if (coverImage) {
                console.log("🔥 [BlogService] Compressing cover image...");
                featuredImageUrl = await compressImageToBase64(coverImage);
                console.log("🔥 [BlogService] Image compressed successfully.");
            }

            const newPostRef = push(ref(db, BLOGS_PATH));
            const id = newPostRef.key!;

            const newPost = {
                ...postData,
                id, // Embedding RTDB Push Key
                featuredImage: featuredImageUrl || '',
                publishedDate: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };

            console.log("🔥 [BlogService] Adding document to RTDB...");
            await set(newPostRef, newPost);
            console.log("🔥 [BlogService] Document added successfully with ID:", id);

            return newPost as BlogPost;
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
            const postRef = ref(db, `${BLOGS_PATH}/${id}`);
            let updatedData = { ...updates, updatedAt: new Date().toISOString() };

            if (newCoverImage && updates.slug) {
                const newImageUrl = await compressImageToBase64(newCoverImage);
                updatedData.featuredImage = newImageUrl;
            }

            await update(postRef, updatedData);
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
            // Note: Since images are now Base64 strings in the record,
            // deleting the record naturally deletes the image data as well.
            await remove(ref(db, `${BLOGS_PATH}/${id}`));
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
            const blogsSnap = await get(ref(db, BLOGS_PATH));
            if (!blogsSnap.exists()) return [];

            const posts: BlogPost[] = [];
            blogsSnap.forEach((child) => {
                posts.push({ ...child.val(), id: child.key } as BlogPost);
            });

            return posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
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
            const blogsSnap = await get(ref(db, BLOGS_PATH));
            if (!blogsSnap.exists()) return [];

            const posts: BlogPost[] = [];
            blogsSnap.forEach((child) => {
                const val = child.val();
                if (val.isPublished) {
                    posts.push({ ...val, id: child.key } as BlogPost);
                }
            });

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
            const blogsSnap = await get(ref(db, BLOGS_PATH));
            if (!blogsSnap.exists()) return null;

            let result: BlogPost | null = null;
            blogsSnap.forEach((child) => {
                const post = child.val();
                if (post.slug === slug) {
                    result = { ...post, id: child.key } as BlogPost;
                }
            });
            return result;
        } catch (error) {
            console.error("Error fetching post by slug:", error);
            return null;
        }
    }
};
