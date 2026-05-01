import { NextRequest } from "next/server";
import {
  authErrorResponse,
  authSuccessResponse,
  isAuthError,
  verifyBearerAuthToken,
} from "@/lib/firebase/api-middleware";
import { adminDb } from "@/lib/firebase/admin";

/**
 * Example protected POST route for Firestore operations
 * POST /api/protected-action - Perform a protected server action
 * 
 * This example shows how to:
 * 1. Verify the user is authenticated
 * 2. Write data to Firestore using admin SDK
 * 3. Ensure data is associated with the authenticated user
 */
export async function POST(request: NextRequest) {
  // Verify authentication
  const auth = await verifyBearerAuthToken(request);
  if (isAuthError(auth)) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const body = await request.json();
    const { title, content } = body;

    // Validate input
    if (!title || !content) {
      return authErrorResponse("Title and content are required", 400);
    }

    // Add document to Firestore with user ID
    const docRef = await adminDb.collection("posts").add({
      userId: auth.uid,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return authSuccessResponse({
      message: "Post created successfully",
      postId: docRef.id,
      userId: auth.uid,
    }, 201);
  } catch (error) {
    console.error("Error creating post:", error);
    return authErrorResponse("Failed to create post", 500);
  }
}

/**
 * Example GET route with query parameters
 * GET /api/protected-action?userId=<uid>
 */
export async function GET(request: NextRequest) {
  // Verify authentication
  const auth = await verifyBearerAuthToken(request);
  if (isAuthError(auth)) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    // Get user's posts from Firestore
    const snapshot = await adminDb
      .collection("posts")
      .where("userId", "==", auth.uid)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return authSuccessResponse({
      userId: auth.uid,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return authErrorResponse("Failed to fetch posts", 500);
  }
}
