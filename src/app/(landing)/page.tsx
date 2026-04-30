'use client';

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TutorialsSection from "@/components/landing/TutorialsSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";

import { ThemeToggle } from "@/components/ui/own/ThemeToggle";

import styles from "@/styles/marketing/landingPage.module.css";

export default function LandingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [user, loading, router]);

    if (loading || user) return null;

    return (<>
        <main className="h-screen overflow-y-scroll snap-y bg-background [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            <div className="flex">
                <ThemeToggle className="fixed top-10 left-10 z-50" />
                <aside className={`${styles.side_image} sticky top-0 hidden h-screen w-1/3 md:block`} />

                <div className="w-full md:w-2/3">
                    <section className="flex h-screen snap-start flex-col justify-between px-8 py-8 md:px-16 md:py-12">
                        <HeroSection />
                    </section>

                    <section className="min-h-screen">
                        <HowItWorksSection />
                        <TutorialsSection />
                        <FinalCtaSection />
                    </section>
                </div>
            </div>
        </main>
    </>
    );
}