import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, authErrorResponse, authSuccessResponse } from "@/lib/firebase/api-middleware";
import { getUserData } from "@/lib/firebase/server-auth";

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
  const auth = await verifyAuthToken(request);
  if (auth.error) {
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
 * Example protected POST route
 * POST /api/user - Update user data in Firestore
 */
export async function POST(request: NextRequest) {
  // Verify authentication
  const auth = await verifyAuthToken(request);
  if (auth.error) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const body = await request.json();
    const { displayName, photoURL, bio } = body;

    // Validate input
    if (!displayName && !photoURL && !bio) {
      return authErrorResponse("No data to update", 400);
    }

    // Get admin instance
    const { adminDb } = await import("@/lib/firebase/admin");

    // Update user profile in Firestore
    await adminDb.collection("users").doc(auth.uid!).set(
      {
        displayName,
        photoURL,
        bio,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return authSuccessResponse({
      message: "User profile updated",
      uid: auth.uid,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return authErrorResponse("Failed to update user profile", 500);
  }
}
