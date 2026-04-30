"use client";

import React, { useState } from "react";

import { useRouter, usePathname } from "next/navigation";

import { signOut } from "@/lib/firebase/auth";
import { appRoutes } from "@/lib/constants";

import { Button } from "@/components/ui/button";

export function SignOutButton({
    text = "Sign out",
    className,
    variant = "outline",
    size = "default",
}: {
    text?: string;
    className?: string;
    variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg";
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = async () => {
        setLoading(true);
        setError(null);

        try {
            await signOut();

            const response = await fetch("/api/auth/session", {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to clear session");
            }

            if (appRoutes.protectedRoutes.includes(pathname)) {
                router.push("/");
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An error occurred during sign-out";
            setError(errorMessage);
            console.error("Sign out error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button
                onClick={handleSignOut}
                disabled={loading}
                variant={variant}
                size={size}
                className={className}
            >
                {loading ? "Signing out..." : text}
            </Button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </div>
    );
}
