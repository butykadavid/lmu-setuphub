"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";

export function UserProfile() {
  const { user, loading } = useAuth();
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    setError(null);
    try {
      await signOut();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during sign-out";
      setError(errorMessage);
      console.error("Sign out error:", err);
    } finally {
      setSignOutLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName || "User"}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="flex-1">
        <p className="font-semibold text-sm">{user.displayName || "User"}</p>
        <p className="text-xs text-gray-600">{user.email}</p>
      </div>
      <Button
        onClick={handleSignOut}
        disabled={signOutLoading}
        variant="outline"
        size="sm"
      >
        {signOutLoading ? "Signing out..." : "Sign out"}
      </Button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
