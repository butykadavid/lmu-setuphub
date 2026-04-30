/**
 * Client-side sign-out function
 * Clears both Firebase auth and server session
 */
export async function signOutUser() {
  try {
    // Call the session API to clear the server-side session
    const response = await fetch("/api/auth/session", {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to clear session");
    }

    // The middleware will now redirect unauthenticated users away from protected routes
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}
