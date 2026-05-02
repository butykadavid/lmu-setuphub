"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LoadingEvent {
    id: string;
    type: "upload" | "fetch" | "default";
    label: string;
}

interface CompletedLoadingEvent extends LoadingEvent {
    completedAt: number;
}

interface LoadingContextType {
    isLoading: boolean;
    events: LoadingEvent[];
    completedEvent: CompletedLoadingEvent | null;
    startLoading: (id: string, type: LoadingEvent["type"], label: string) => void;
    stopLoading: (id: string) => void;
    clearCompletedEvent: () => void;
    clearAll: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<LoadingEvent[]>([]);
    const [completedEvent, setCompletedEvent] =
        useState<CompletedLoadingEvent | null>(null);

    const startLoading = useCallback((id: string, type: "upload" | "fetch" | "default", label: string) => {
        setEvents((prev) => {
            const filtered = prev.filter((e) => e.id !== id);
            return [...filtered, { id, label, type }];
        });
    }, []);

    const stopLoading = useCallback((id: string) => {
        setEvents((prev) => {
            const stoppedEvent = prev.find((e) => e.id === id);

            if (stoppedEvent?.type === "upload") {
                setCompletedEvent({
                    ...stoppedEvent,
                    completedAt: Date.now(),
                });
            }

            return prev.filter((e) => e.id !== id);
        });
    }, []);

    const clearCompletedEvent = useCallback(() => {
        setCompletedEvent(null);
    }, []);

    const clearAll = useCallback(() => {
        setEvents([]);
        setCompletedEvent(null);
    }, []);

    const isLoading = events.length > 0;

    return (
        <LoadingContext.Provider
            value={{
                isLoading,
                events,
                completedEvent,
                startLoading,
                stopLoading,
                clearCompletedEvent,
                clearAll,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}
