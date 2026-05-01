"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { User, onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function syncServerSession(user: User | null) {
  if (user) {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync server session");
    }

    return;
  }

  const response = await fetch("/api/auth/session", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear server session");
  }
}

async function syncUserDocument(user: User | null) {
  if (!user) return;

  const idToken = await user.getIdToken();
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to sync user document");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const initializedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (!initializedRef.current) {
          initializedRef.current = true;
          setLoading(false);
        }

        try {
          await syncServerSession(currentUser);
          if (currentUser) {
            await syncUserDocument(currentUser);
          }
          setError(undefined);
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Synchronization failed"));
        }
      },
      (err) => {
        setError(err as Error);
        if (!initializedRef.current) {
          initializedRef.current = true;
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
