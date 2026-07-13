import { db } from './firebase';
import { collection, doc, setDoc, getDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';

/**
 * Save user subscription data to Firestore
 */
export async function saveUserSubscription(
  userId: string,
  subscriptionData: {
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    status: string;
    currentPeriodEnd: Date;
    isPremium: boolean;
  }
) {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...subscriptionData,
      updatedAt: new Date(),
    }, { merge: true });
    console.log('[Firebase] Subscription saved for user:', userId);
  } catch (error) {
    console.error('[Firebase] Error saving subscription:', error);
    throw error;
  }
}

/**
 * Get user subscription data
 */
export async function getUserSubscription(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('[Firebase] Error getting subscription:', error);
    return null;
  }
}

/**
 * Check if user is premium
 */
export async function isUserPremium(userId: string): Promise<boolean> {
  try {
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) return false;
    
    // Check if subscription is active
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return false;
    }
    
    // Check if subscription hasn't expired
    if (subscription.currentPeriodEnd) {
      const endDate = subscription.currentPeriodEnd.toDate ? subscription.currentPeriodEnd.toDate() : new Date(subscription.currentPeriodEnd);
      if (new Date() > endDate) {
        return false;
      }
    }
    
    return subscription.isPremium === true;
  } catch (error) {
    console.error('[Firebase] Error checking premium status:', error);
    return false;
  }
}

/**
 * Save user frequency history
 */
export async function saveFrequencyHistory(
  userId: string,
  frequency: number,
  duration: number
) {
  try {
    const historyRef = collection(db, 'users', userId, 'frequencyHistory');
    const newEntry = doc(historyRef);
    
    await setDoc(newEntry, {
      frequency,
      duration,
      timestamp: new Date(),
    });
    
    console.log('[Firebase] Frequency history saved');
  } catch (error) {
    console.error('[Firebase] Error saving frequency history:', error);
    throw error;
  }
}

/**
 * Get user frequency history
 */
export async function getFrequencyHistory(userId: string, limit: number = 10) {
  try {
    const historyRef = collection(db, 'users', userId, 'frequencyHistory');
    const q = query(historyRef);
    const querySnapshot = await getDocs(q);
    
    const history = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Sort by timestamp descending and limit
    return history
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .slice(0, limit);
  } catch (error) {
    console.error('[Firebase] Error getting frequency history:', error);
    return [];
  }
}

/**
 * Save favorite frequency
 */
export async function saveFavoriteFrequency(
  userId: string,
  frequency: number,
  name: string
) {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const newFavorite = doc(favoritesRef);
    
    await setDoc(newFavorite, {
      frequency,
      name,
      createdAt: new Date(),
    });
    
    console.log('[Firebase] Favorite frequency saved');
  } catch (error) {
    console.error('[Firebase] Error saving favorite:', error);
    throw error;
  }
}

/**
 * Get user favorite frequencies
 */
export async function getFavoriteFrequencies(userId: string) {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const querySnapshot = await getDocs(favoritesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[Firebase] Error getting favorites:', error);
    return [];
  }
}
