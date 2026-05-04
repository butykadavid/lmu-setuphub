"use client";

import { useEffect } from "react";

import { motion } from "motion/react"

import { CheckCheck, Loader2 } from "lucide-react";

import { useLoading } from "@/context/LoadingContext";

export function LoaderOverlay({message}: {message?: string}) {
    const { isLoading, events, completedEvent, clearCompletedEvent } = useLoading();

    useEffect(() => {
        if (completedEvent?.type === "upload") {
            const timeout = setTimeout(() => {
                clearCompletedEvent();
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [completedEvent, clearCompletedEvent]);

    if (!isLoading && !completedEvent) {
        return null;
    }

    const currentEvent = events[events.length - 1];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                {completedEvent?.type === "upload" ? (
                    <SuccessContent text="Upload complete" />
                ) : (
                    <DefaultContent text={currentEvent?.label || "Loading..."} />
                )}
            </div>
        </div>
    )
}

function DefaultContent({ text }: { text: string }) {
    return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-center text-md font-semibold text-muted-foreground">
            {text}
        </p>
    </motion.div>
}

function SuccessContent({ text }: { text: string }) {
    return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
        <CheckCheck className="h-12 w-12 text-green-400" />
        <p className="text-center text-md font-semibold text-green-400">
            {text}
        </p>
    </motion.div>
}
