import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/server-auth";

/**
 * Middleware to verify Firebase auth token in API requests
 * Use this to protect API routes that require authentication
 *
 * Usage in API route:
 * const { uid, decodedToken } = await verifyAuthToken(req);
 */
export async function verifyAuthToken(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return {
        error: "No authorization token provided",
        status: 401,
      };
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    try {
      const decodedToken = await verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        decodedToken,
      };
    } catch (error) {
      return {
        error: "Invalid or expired token",
        status: 401,
      };
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    return {
      error: "Internal server error",
      status: 500,
    };
  }
}

/**
 * Helper to send error response
 */
export function authErrorResponse(message: string, status: number = 401) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Helper to send success response
 */
export function authSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
