"use client";

import React, { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/firebase/auth";

export function GoogleSignInButton({
  text = "Sign in with Google",
  transition = true,
  className,
}: {
  text?: string;
  transition?: boolean;
  className?: string;
}) {
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
        variant="outline"
        className={`relative overflow-hidden ${transition ? "group" : ""} ${className}`}
      >
        {/* LOADING STATE */}
        {loading ? (
          <span className="flex items-center justify-center">
            Signing in...
          </span>
        ) : transition ? (
          <>
            <span
              className="
                flex items-center justify-center gap-2
                transition-opacity duration-300
                group-hover:opacity-0
              "
            >
              {text}
            </span>

            <span
              className="
                absolute inset-0
                flex items-center justify-center
                opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
                mt-1
              "
            >
              <Image
                src="/icons/google_logo_full.png"
                alt="Google"
                width={120}
                height={24}
                className="object-contain"
              />
            </span>
          </>
        ) : (
          <span className="flex items-center justify-center mt-1">
            <Image
              src="/icons/google_logo_full.png"
              alt="Google"
              width={120}
              height={24}
              className="object-contain"
            />
          </span>
        )}
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}