"use client";

import { createContext, useContext, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import LandingSideBar from "@/app/(landing)/LandingSideBar";

type AuthGateContextValue = {
  requireAuth: (callback?: () => void) => void;
  requireAuthNavigation: (href: string) => void;
  openSignIn: () => void;
};

const AuthGateContext = createContext<AuthGateContextValue | null>(null);

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const openSignIn = () => setOpen(true);

  const requireAuth = (callback?: () => void) => {
    if (loading) return;

    if (!user) {
      setOpen(true);
      return;
    }

    callback?.();
  };

  const requireAuthNavigation = (href: string) => {
    requireAuth(() => router.push(href));
  };

  return (
    <AuthGateContext.Provider
      value={{
        requireAuth,
        requireAuthNavigation,
        openSignIn,
      }}
    >
      {children}

      <LandingSideBar open={open} onClose={() => setOpen(false)} />
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const context = useContext(AuthGateContext);

  if (!context) {
    throw new Error("useAuthGate must be used inside AuthGateProvider");
  }

  return context;
}