import { adminAuth, adminDb } from "./admin";
import { DecodedIdToken } from "firebase-admin/auth";

/**
 * Verify an ID token and return the decoded token
 * Use this in API routes to authenticate requests
 */
export async function verifyIdToken(token: string): Promise<DecodedIdToken> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw new Error("Invalid or expired token");
  }
}

/**
 * Get the current user from an ID token
 */
export async function getUserFromToken(token: string) {
  try {
    const decodedToken = await verifyIdToken(token);
    const user = await adminAuth.getUser(decodedToken.uid);
    return user;
  } catch (error) {
    console.error("Error getting user from token:", error);
    throw error;
  }
}

/**
 * Get user data from Firestore using admin SDK
 * Note: This bypasses security rules
 */
export async function getUserData(uid: string) {
  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}

/**
 * Create or update user profile in Firestore
 */
export async function setUserProfile(
  uid: string,
  data: Record<string, any>
) {
  try {
    await adminDb.collection("users").doc(uid).set(data, { merge: true });
  } catch (error) {
    console.error("Error setting user profile:", error);
    throw error;
  }
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(uid: string) {
  try {
    await adminAuth.deleteUser(uid);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
