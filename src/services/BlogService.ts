import { ref, push, set, get, update, remove } from 'firebase/database';
import { db, auth } from '../firebase.config';
import type { BlogPost } from '../types';
import { compressImageToBase64 } from '../utils/imageUtils';

const BLOGS_PATH = 'blogs';

/**
 * Ensures the user is strictly authenticated (via Email/Password)
 * before making any authenticated RTDB writes for Blogs.
 */
const ensureAdminAuth = async (): Promise<void> => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        throw new Error("PERMISSION_DENIED: You must be logged in as an Admin to manage blogs.");
    }
    console.log("🔐 [BlogService] Admin authenticated:", auth.currentUser.uid);
};

export const BlogService = {
    /**
     * Create a new blog post
     */
    createPost: async (postData: Omit<BlogPost, 'id' | 'publishedDate'>, coverImage?: File): Promise<BlogPost> => {
        try {
            // STEP 0: Ensure we are authenticated before writing
            await ensureAdminAuth();

            console.log("🔥 [BlogService] Starting createPost...");
            let featuredImageUrl = postData.featuredImage || '';

            if (coverImage) {
                console.log("🔥 [BlogService] Compressing cover image...");
                featuredImageUrl = await compressImageToBase64(coverImage);
                console.log("🔥 [BlogService] Image compressed successfully.");
            }

            const newPostRef = push(ref(db, BLOGS_PATH));
            const id = newPostRef.key!;

            const newPost = {
                ...postData,
                id,
                featuredImage: featuredImageUrl,
                publishedDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                tags: postData.tags || [],
                seoTitle: postData.seoTitle || '',
                seoDescription: postData.seoDescription || ''
            };

            // RTDB rejects undefined properties — scrub them all out
            const cleanPost = JSON.parse(JSON.stringify(newPost));

            console.log("🔥 [BlogService] Adding document to RTDB...");
            await set(newPostRef, cleanPost);
            console.log("🔥 [BlogService] Document added successfully with ID:", id);

            return cleanPost as BlogPost;
        } catch (error: any) {
            console.error("❌ Error creating blog post:", error);
            throw new Error(`Failed to create blog post: ${error.message || error}`);
        }
    },

    /**
     * Update an existing blog post
     */
    updatePost: async (id: string, updates: Partial<BlogPost>, newCoverImage?: File): Promise<void> => {
        try {
            await ensureAdminAuth();

            const postRef = ref(db, `${BLOGS_PATH}/${id}`);
            let updatedData = { ...updates, updatedAt: new Date().toISOString() };

            if (newCoverImage) {
                const newImageUrl = await compressImageToBase64(newCoverImage);
                updatedData.featuredImage = newImageUrl;
            }

            const cleanUpdates = JSON.parse(JSON.stringify(updatedData));
            await update(postRef, cleanUpdates);
        } catch (error: any) {
            console.error("Error updating blog post:", error);
            throw new Error(`Failed to update blog post: ${error.message || error}`);
        }
    },

    /**
     * Delete a blog post
     */
    deletePost: async (id: string, imageUrl?: string): Promise<void> => {
        try {
            await ensureAdminAuth();
            await remove(ref(db, `${BLOGS_PATH}/${id}`));
        } catch (error: any) {
            console.error("Error deleting blog post:", error);
            throw new Error(`Failed to delete blog post: ${error.message || error}`);
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
