import { db } from '../firebase.config';
import { ref, onValue, set } from 'firebase/database';

export const ConfigService = {
    // Subscribe to Offers Enabled Status
    subscribeToOffersStatus: (callback: (enabled: boolean) => void) => {
        const statusRef = ref(db, 'config/offersEnabled');
        return onValue(statusRef, (snapshot) => {
            const val = snapshot.val();
            // Default to TRUE if not set
            callback(val !== false);
        });
    },

    // Set Offers Enabled Status
    setOffersStatus: async (enabled: boolean) => {
        try {
            const statusRef = ref(db, 'config/offersEnabled');
            await set(statusRef, enabled);
        } catch (error) {
            console.error("Firebase Write Error:", error);
            alert("Admin Toggle Failed: Check Firebase Rules or Console Permissions.");
        }
    }
};
