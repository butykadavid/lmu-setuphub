"use client";

import { Activity } from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { PillBadge } from "@/components/ui/PillBadge";

export default function HeroSection() {
    return (
        <section className="h-screen flex bg-background">
            <div className="flex h-full w-full flex-col justify-between bg-background max-w-7xl">
                <header className="flex items-center justify-between">
                    <div className="text-xl font-bold tracking-tight text-foreground">
                        LMU Setup Hub
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-sm text-muted-foreground">
                            Already a member?
                        </p>
                        <GoogleSignInButton />
                    </div>
                </header>

                <main className="max-w-4xl">
                    <PillBadge
                        logo={<Activity className="h-4 w-4" />}
                        text="Telemetry-backed setup sharing for Le Mans Ultimate"
                        color="primary"
                        mode="hero"
                        className="mb-6"
                    />

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[0.95]">
                        Stop guessing.
                        <br />
                        Drive verified setups.
                    </h1>

                    <p className="mt-8 max-w-2xl text-lg md:text-xl leading-8 text-muted-foreground">
                        Upload native LMU telemetry, extract setup data automatically, and
                        share lap-time-proven setups with your team, league, or community.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Button className="rounded-xl px-7 py-6 font-semibold">
                            Explore setups
                        </Button>

                        <Button className="rounded-xl px-7 py-6 font-semibold">
                            Upload telemetry
                        </Button>
                    </div>
                </main>

                <footer className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        [".duckdb", "Native telemetry upload"],
                        ["Auto", "Car, track, weather & setup extraction"],
                        ["Verified", "Lap-time-backed setup pages"],
                    ].map(([title, text]) => (
                        <div
                            key={title}
                            className="rounded-2xl border border-border bg-card p-5 text-card-foreground"
                        >
                            <div className="text-3xl font-bold">{title}</div>
                            <div className="mt-2 text-sm text-muted-foreground">{text}</div>
                        </div>
                    ))}
                </footer>
            </div>
        </section>
    )
}