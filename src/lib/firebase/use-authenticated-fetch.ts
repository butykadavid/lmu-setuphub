"use client";

import { useAuth } from "@/context/AuthContext";
import { authorizedJsonFetch } from "./authenticated-fetch";

/**
 * Hook to make authenticated JSON requests
 */
export function useAuthenticatedFetch() {
  const { user } = useAuth();

  return (input: RequestInfo | URL, init?: any) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    return authorizedJsonFetch(user, input, init);
  };
}
