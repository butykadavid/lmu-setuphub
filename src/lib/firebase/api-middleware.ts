import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, verifySessionToken } from "@/lib/firebase/server-auth";

export type AuthSuccessResult = {
  uid: string;
  decodedToken: Awaited<ReturnType<typeof verifyIdToken>>;
};

export type AuthErrorResult = {
  error: string;
  status: number;
};

export type AuthResult = AuthSuccessResult | AuthErrorResult;

function missingTokenResult(): AuthResult {
  return {
    error: "No authorization token provided",
    status: 401,
  };
}

function invalidTokenResult(): AuthResult {
  return {
    error: "Invalid or expired token",
    status: 401,
  };
}

export function isAuthError(result: AuthResult): result is AuthErrorResult {
  return "error" in result;
}

/**
 * Middleware to verify Firebase auth token in API requests
 * Use this to protect API routes that require authentication
 *
 * Usage in API route:
 * const { uid, decodedToken } = await verifyAuthToken(req);
 */
export async function verifyAuthToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const sessionToken = req.cookies.get("__session")?.value;
    const token = bearerToken ?? sessionToken;

    if (!token) {
      return missingTokenResult();
    }

    try {
      const decodedToken = bearerToken
        ? await verifyIdToken(token)
        : await verifySessionToken(token);

      return {
        uid: decodedToken.uid,
        decodedToken,
      };
    } catch {
      return invalidTokenResult();
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
 * Verify Bearer token only. Use this for client-initiated protected API calls.
 */
export async function verifyBearerAuthToken(req: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!bearerToken) {
      return missingTokenResult();
    }

    try {
      const decodedToken = await verifyIdToken(bearerToken);

      return {
        uid: decodedToken.uid,
        decodedToken,
      };
    } catch {
      return invalidTokenResult();
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
export function authSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
