"use client";

import React, { useState } from "react";

import { KeySquare } from "lucide-react";

import { Button } from "@/components/ui/button";

import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { useAuth } from "@/context/AuthContext";

export function GoogleSignInButton() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during sign-in";
      setError(errorMessage);
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleSignIn}
        disabled={loading}
        variant="default"
        className="w-full"
      >
        {loading ? "Signing in..." : <><KeySquare className="h-4 w-4" /> Sign in with Google</>}
      </Button>
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
