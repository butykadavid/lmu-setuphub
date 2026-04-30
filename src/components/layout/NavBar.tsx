"use client";

import { useEffect, useState } from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ThemeToggle } from "@/components/ui/own/ThemeToggle";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/ui/own/FileUploader";

import { inspectDuckDbFile } from "../../lib/telemetry/parse-duckdb-browser";

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
                          {/*<AvatarBadge className="bg-green-600 dark:bg-green-800" /> */}
                        </Avatar>
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          {user.displayName || user.email}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="start">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                        <DropdownMenuItem disabled>
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
                <GoogleSignInButton />
              )}
            </div>
          </div>
        </div>
      </nav>

      <UploadDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen} />

    </>
  );
}

const UploadDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesSelected(files: File[]) {
    const file = files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const parsed = await inspectDuckDbFile(file);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>
          <DialogDescription>
            Grab your generated telemetry file and drop it here!
          </DialogDescription>
        </DialogHeader>
        <FileUploader onFilesSelected={handleFilesSelected} />

        {loading && (
          <p className="mt-4 text-muted-foreground">Inspecting DuckDB file...</p>
        )}

        {error && (
          <p className="mt-4 text-destructive">{error}</p>
        )}

        {result && (
          <div className="mt-8">
            <TelemetryMetadataPreview metadata={result.metadata} />
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Cloud, Clock, Flag, MapPinned, Route, Timer, Wrench } from "lucide-react";

type MetadataItem = {
  key: string;
  value: string;
};

function getMeta(metadata: MetadataItem[], key: string) {
  return metadata.find((item) => item.key === key)?.value ?? "—";
}

export function TelemetryMetadataPreview({
  metadata,
}: {
  metadata: MetadataItem[];
}) {
  const trackName = getMeta(metadata, "TrackName");
  const trackLayout = getMeta(metadata, "TrackLayout");
  const carClass = getMeta(metadata, "CarClass");
  const carName = getMeta(metadata, "CarName");
  const weather = getMeta(metadata, "WeatherConditions");
  const sessionTime = getMeta(metadata, "SessionTime");
  const sessionType = getMeta(metadata, "SessionType");
  const version = getMeta(metadata, "Version");

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl font-black tracking-tight">
              Telemetry detected
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Review the extracted session details before publishing.
            </p>
          </div>

          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            LMU telemetry v{version}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 p-6 md:grid-cols-2">
        <InfoTile icon={<MapPinned />} label="Track" value={trackName} />
        <InfoTile icon={<Route />} label="Layout" value={trackLayout} />
        <InfoTile icon={<Car />} label="Car class" value={carClass} />
        <InfoTile icon={<Wrench />} label="Entry / car name" value={carName} />
        <InfoTile icon={<Cloud />} label="Weather" value={weather} />
        <InfoTile icon={<Clock />} label="Session time" value={sessionTime} />
        <InfoTile icon={<Flag />} label="Session type" value={sessionType} />
      </CardContent>
    </Card>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
        {label}
      </div>

      <div className="break-words text-lg font-bold text-foreground">
        {value}
      </div>
    </div>
  );
}