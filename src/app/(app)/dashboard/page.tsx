"use client";

import { useAuth } from "@/context/AuthContext";

import { Activity, Clock, Download, Gauge, Plus, Star, Upload } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PillBadge } from "@/components/ui/own/PillBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-background p-6 md:p-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                <section className="flex flex-col gap-2">
                    <PillBadge text="Driver Dashboard" color="primary" mode="default" />

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-foreground">
                                Welcome back{user?.displayName ? `, ${user.displayName}` : ""}.
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Manage your verified setups, saved builds, and telemetry-backed laps.
                            </p>
                        </div>

                        <Button className="w-fit gap-2">
                            <Upload className="h-4 w-4" />
                            Upload telemetry
                        </Button>
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-lg">Driver profile</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black text-primary">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={`${user.photoURL}`} alt={`${user.displayName || user.email}`} />
                                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1">
                                <div className="text-2xl font-bold text-foreground">
                                    {user?.displayName ?? "Unnamed Driver"}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {user?.email ?? "No email available"}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <PillBadge text="GT3 Rookie" color="primary" mode="default" />
                                    <PillBadge text="No public setups yet" color="neutral" mode="default" />
                                    <PillBadge text="Telemetry ready" color="lime" mode="default" />
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    <StatCard
                        icon={<Gauge className="h-5 w-5" />}
                        label="Verified setups"
                        value="0"
                        text="Upload telemetry to create your first verified setup."
                    />

                    <StatCard
                        icon={<Clock className="h-5 w-5" />}
                        label="Best uploaded lap"
                        value="—"
                        text="No lap data imported yet."
                    />
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <MiniCard
                        icon={<Activity className="h-5 w-5" />}
                        title="Telemetry parser"
                        text="Ready to extract car, track, weather, setup values, and lap data."
                    />
                    <MiniCard
                        icon={<Star className="h-5 w-5" />}
                        title="Saved setups"
                        text="Bookmark community setups once browsing is available."
                    />
                    <MiniCard
                        icon={<Download className="h-5 w-5" />}
                        title="Downloads"
                        text="Track which setups you have used and tested."
                    />
                </section>

                <section>
                    <Tabs defaultValue="uploaded" className="w-full">
                        <div className="mb-4 flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
                                <TabsTrigger value="saved">Saved</TabsTrigger>
                                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                            </TabsList>

                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                New upload
                            </Button>
                        </div>

                        <TabsContent value="uploaded">
                            <EmptyContent
                                title="No uploaded setups yet"
                                text="Upload a native LMU .duckdb telemetry file and we’ll generate a verified setup page automatically."
                                button="Upload telemetry"
                            />
                        </TabsContent>

                        <TabsContent value="saved">
                            <EmptyContent
                                title="No saved setups"
                                text="Saved community setups will appear here once you start browsing."
                                button="Explore setups"
                            />
                        </TabsContent>

                        <TabsContent value="drafts">
                            <EmptyContent
                                title="No drafts"
                                text="Unpublished setup pages and partially parsed telemetry uploads will appear here."
                                button="Create draft"
                            />
                        </TabsContent>
                    </Tabs>
                </section>
            </div>
        </main>
    );
}

function StatCard({
    icon,
    label,
    value,
    text,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    text: string;
}) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {icon}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="mt-1 text-4xl font-black text-foreground">{value}</div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </CardContent>
        </Card>
    );
}

function MiniCard({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) {
    return (
        <Card className="bg-card/70">
            <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                    {icon}
                </div>
                <h3 className="font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </CardContent>
        </Card>
    );
}

function EmptyContent({
    title,
    text,
    button,
}: {
    title: string;
    text: string;
    button: string;
}) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Upload className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-bold text-foreground">{title}</h3>

                <p className="mt-3 max-w-md text-muted-foreground">{text}</p>

                <Button className="mt-6">{button}</Button>
            </CardContent>
        </Card>
    );
}