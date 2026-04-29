"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

import { signOut } from "@/lib/firebase/auth";

export function NavBar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-primary">🚀</span>
            LMU SetupHub
          </Link>

          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-sm text-muted-foreground">Loading...</span>
            ) : user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.displayName || user.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  variant="outline"
                  size="sm"
                >
                  {signingOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            ) : (
              <GoogleSignInButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}