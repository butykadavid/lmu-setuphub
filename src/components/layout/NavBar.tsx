"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ThemeToggle } from "@/components/ui/own/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UploadDialog } from "@/components/ui/own/UploadDialog";

export function NavBar() {
  const { user, loading } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              LMU SetupHub
            </Link>
            <ThemeToggle />

            <div className="flex items-center gap-2">
              {loading ? (
                <span className="text-sm text-muted-foreground">Loading...</span>
              ) : user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} className="py-6 flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={`${user.photoURL}`} alt={`${user.displayName || user.email}`} />
                          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          {user.displayName || user.email}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="start">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push("/browse")}>
                          Browse
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          Teams
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                        <DropdownMenuItem disabled>
                          Invite friends
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}>
                          Upload
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Support</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push("/about")}>
                          About
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          Contact Us
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <SignOutButton
                          className="m-0 p-1 w-full h-full text-destructive"
                          text="Sign out"
                          variant="ghost">
                        </SignOutButton>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <GoogleSignInButton text="Sign In" className="w-32"/>
              )}
            </div>
          </div>
        </div>
      </nav>

      <UploadDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen} />

    </>
  );
}