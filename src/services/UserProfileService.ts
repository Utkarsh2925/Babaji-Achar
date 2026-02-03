import { db } from '../firebase.config';
import { ref, set, get, update } from 'firebase/database';

export interface UserAddress {
    house: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
}

export interface UserProfile {
    phone: string;
    fullName: string;
    email: string;
    gender: 'male' | 'female' | 'other' | '';
    address: UserAddress;
    createdAt?: string;
    updatedAt?: string;
}

export const UserProfileService = {
    // Save or update user profile
    saveProfile: async (profile: UserProfile): Promise<void> => {
        try {
            const userRef = ref(db, `users/${profile.phone}`);
            await set(userRef, {
                ...profile,
                updatedAt: new Date().toISOString(),
                createdAt: profile.createdAt || new Date().toISOString()
            });
            console.log('User profile saved to Firebase:', profile.phone);
        } catch (error) {
            console.error('Error saving user profile:', error);
            throw error;
        }
    },

    // Get user profile by phone number
    getProfile: async (phone: string): Promise<UserProfile | null> => {
        try {
            const userRef = ref(db, `users/${phone}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                console.log('User profile loaded from Firebase:', phone);
                return snapshot.val() as UserProfile;
            }

            console.log('No profile found for phone:', phone);
            return null;
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    },

    // Update only address
    updateAddress: async (phone: string, address: UserAddress): Promise<void> => {
        try {
            const userRef = ref(db, `users/${phone}`);
            await update(userRef, {
                address,
                updatedAt: new Date().toISOString()
            });
            console.log('User address updated in Firebase:', phone);
        } catch (error) {
            console.error('Error updating user address:', error);
            throw error;
        }
    },

    // Update specific fields
    updateProfile: async (phone: string, updates: Partial<UserProfile>): Promise<void> => {
        try {
            const userRef = ref(db, `users/${phone}`);
            await update(userRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
            console.log('User profile updated in Firebase:', phone);
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }
};
