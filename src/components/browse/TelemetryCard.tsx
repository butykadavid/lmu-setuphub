"use client";

import type { TelemetrySummary } from "@/lib/telemetry/types";
import { convertSecondsToTime, formatTimeAgo } from "@/lib/functions";
import { MapPinned, Car, Clock } from "lucide-react";
import { PillBadge } from "@/components/ui/own/PillBadge";
import { Card, CardContent } from "@/components/ui/card";


export function TelemetryCard({ data }: { data: TelemetrySummary }) {
  return (
    <Card className="group overflow-hidden transition hover:border-primary/40 hover:bg-card/80">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <PillBadge mode="default" text={data.carClass || "Unknown"}/>

            <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-tight text-foreground">
              {data.carModel || "Unknown car"}
            </h2>
          </div>

          <div className="rounded-xl bg-primary/10 px-3 py-2 text-right">
            <div className="text-xs text-primary">Best lap</div>
            <div className="font-black text-foreground">
              {convertSecondsToTime(data.telemetry.bestLap?.lapTime)}
            </div>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <InfoRow
            icon={<MapPinned />}
            label="Track"
            value={data.trackLayout || data.trackName || "Unknown"}
          />

          <InfoRow
            icon={<Car />}
            label="Entry"
            value={data.carModel || "Unknown"}
          />

          <InfoRow
            icon={<Clock />}
            label="Uploaded"
            value={formatTimeAgo(data.createdAt)}
          />
        </div>

        {data.driverNote && (
          <p className="line-clamp-2 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
            {data.driverNote}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            by {data.uploaderName ?? "Unknown driver"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>

      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}