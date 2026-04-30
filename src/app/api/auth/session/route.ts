import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/server-auth";

/**
 * POST /api/auth/session - Create a session cookie
 * Called after Firebase client-side auth to establish server-side session
 * 
 * Body:
 * {
 *   "idToken": "<Firebase ID token from client>"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the token is valid
    const decodedToken = await verifyIdToken(idToken);

    // Create response with session cookie
    const response = NextResponse.json(
      { success: true, uid: decodedToken.uid },
      { status: 200 }
    );

    // Set secure session cookie
    response.cookies.set("__session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

/**
 * DELETE /api/auth/session - Clear the session cookie (sign out)
 */
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: "Signed out successfully" },
    { status: 200 }
  );

  response.cookies.delete("__session");

  return response;
}
