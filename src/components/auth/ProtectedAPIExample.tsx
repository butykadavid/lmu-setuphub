"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

/**
 * Example component showing how to call protected API routes
 */
export function ProtectedAPIExample() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const callProtectedAPI = async () => {
    if (!user) {
      setError("You must be signed in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the user's ID token
      const idToken = await user.getIdToken();

      // Call the protected API route
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to call API";
      setError(errorMessage);
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-gray-500">Sign in to use protected APIs</p>;
  }

  return (
    <div className="space-y-4">
      <Button onClick={callProtectedAPI} disabled={loading}>
        {loading ? "Loading..." : "Call Protected API"}
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <div className="p-4 bg-gray-100 rounded text-sm">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
