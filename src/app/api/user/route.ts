import { NextRequest } from "next/server";
import {
  authErrorResponse,
  authSuccessResponse,
  isAuthError,
  verifyBearerAuthToken,
} from "@/lib/firebase/api-middleware";
import { getUserData } from "@/lib/firebase/server-auth";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Example protected API route
 * GET /api/user - Get current user data from Firestore
 * 
 * Request headers:
 * Authorization: Bearer <idToken>
 * 
 * The ID token can be obtained from the client with:
 * const token = await user.getIdToken();
 */
export async function GET(request: NextRequest) {
  // Verify authentication
  const auth = await verifyBearerAuthToken(request);
  if (isAuthError(auth)) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    // Get user data from Firestore
    const userData = await getUserData(auth.uid!);

    return authSuccessResponse({
      uid: auth.uid,
      user: userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return authErrorResponse("Failed to fetch user data", 500);
  }
}

/**
 * POST /api/user - Create or update user document
 * On first login, creates user record with email, displayName, photoURL
 * On subsequent updates, updates displayName, photoURL, bio
 */
export async function POST(request: NextRequest) {
  // Verify authentication
  const auth = await verifyBearerAuthToken(request);
  if (isAuthError(auth)) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const body = await request.json();
    const { email, displayName, photoURL, bio } = body;

    // For first login, require email and displayName
    if (!displayName) {
      return authErrorResponse("displayName is required", 400);
    }

    const userRef = adminDb.collection("users").doc(auth.uid!);
    const userDoc = await userRef.get();
    const now = Timestamp.now();

    if (userDoc.exists) {
      // Update existing user - only update provided fields
      const updateData: Record<string, any> = {
        updatedAt: now,
      };
      
      if (displayName) updateData.displayName = displayName;
      if (photoURL !== undefined) updateData.photoURL = photoURL || null;
      if (bio !== undefined) updateData.bio = bio;

      await userRef.update(updateData);
    } else {
      // Create new user document on first login
      if (!email) {
        return authErrorResponse("email is required for new user", 400);
      }

      await userRef.set({
        uid: auth.uid!,
        email,
        displayName,
        photoURL: photoURL || null,
        createdAt: now,
        updatedAt: now,
      });
    }

    return authSuccessResponse({
      message: userDoc.exists ? "User profile updated" : "User created successfully",
      uid: auth.uid,
    }, 200);
  } catch (error) {
    console.error("Error syncing user:", error);
    return authErrorResponse("Failed to sync user", 500);
  }
}
