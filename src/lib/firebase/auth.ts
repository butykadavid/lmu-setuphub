import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
