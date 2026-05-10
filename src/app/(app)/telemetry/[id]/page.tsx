"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useAuthenticatedFetch } from "@/lib/firebase/use-authenticated-fetch";
import { TelemetryDataDisplay } from "@/components/ui/own/TelemetryDataDisplay";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { TelemetryParseResult } from "@/lib/telemetry/types";

export default function TelemetryDetailPage() {
  const params = useParams<{ id: string }>();
  const authenticatedFetch = useAuthenticatedFetch();

  const [data, setData] = useState<TelemetryParseResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id;

  useEffect(() => {
    if (!id) return;

    async function loadTelemetry() {
      setLoading(true);
      setError(null);

      try {
        const response = await authenticatedFetch(`/api/telemetry/${id}`);

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error ?? "Failed to load telemetry");
        }

        setData(json.data ?? json);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error while loading telemetry"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTelemetry();
  }, []);

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">

        {loading && <TelemetryDetailSkeleton />}

        {!loading && error && (
          <Card className="border-destructive/40 bg-destructive/10">
            <CardContent className="flex items-center gap-3 p-6 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        {!loading && !error && data && <TelemetryDataDisplay data={data} />}
      </div>
    </main>
  );
}

function TelemetryDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="h-32 animate-pulse rounded bg-muted" />
          <div className="h-32 animate-pulse rounded bg-muted" />
          <div className="h-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  );
}