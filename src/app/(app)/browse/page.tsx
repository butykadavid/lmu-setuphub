"use client";

import { useEffect, useState } from "react";
import { Search, Gauge } from "lucide-react";

import { useAuthenticatedFetch } from "@/lib/firebase/use-authenticated-fetch";
import { TelemetrySummary } from "@/lib/telemetry/types";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TelemetryCard } from "@/components/browse/TelemetryCard";

export default function BrowseTelemetriesPage() {
  const authenticatedFetch = useAuthenticatedFetch();

  const [data, setData] = useState<TelemetrySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadTelemetries() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("q", search.trim());
        }

        params.set("limit", "24");

        const res = await authenticatedFetch(`/api/browse/telemetries?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Failed to load telemetry uploads");
        }

        const json = await res.json();

        setData(json.telemetries ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(loadTelemetries, 250);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="secondary" className="mb-3">
              Community telemetry
            </Badge>

            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Browse verified uploads
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Explore uploaded LMU setup telemetry. Full channels are loaded
              only when you open an upload.
            </p>
          </div>

          <Button>Upload telemetry</Button>
        </section>

        <section className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search car, track, class, driver note..."
            className="pl-9"
          />
        </section>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-56 animate-pulse bg-muted/40" />
            ))}
          </div>
        )}

        {error && (
          <Card className="border-destructive/40 bg-destructive/10">
            <CardContent className="p-6 text-destructive">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && data.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <Gauge className="mb-4 h-10 w-10 text-muted-foreground" />

              <h2 className="text-2xl font-bold text-foreground">
                No telemetry uploads found
              </h2>

              <p className="mt-2 max-w-md text-muted-foreground">
                Try a different search, or upload the first telemetry file for
                this car and track.
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && data.length > 0 && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((d) => (
              <TelemetryCard key={d.id} data={d} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}