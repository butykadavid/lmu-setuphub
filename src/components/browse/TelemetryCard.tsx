"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PillBadge } from "@/components/ui/own/PillBadge";
import type { TelemetrySummary } from "@/app/api/browse/telemetries/route";
import { Map } from "lucide-react";
import { convertSecondsToTime, formatTimeAgo, extractMetadataValue } from "@/lib/functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TelemetryDataDisplay } from "../ui/own/TelemetryDataDisplay";

interface TelemetryCardProps {
  telemetry: TelemetrySummary;
  onClick?: () => void;
}

export function TelemetryCard({ telemetry, onClick }: TelemetryCardProps) {
  const [open, setOpen] = useState(false);

  const createdDate = new Date(telemetry.createdAt);
  const timeAgo = formatTimeAgo(createdDate);

  const metaData = telemetry.telemetry.metadata;
  const setup = telemetry.telemetry.setup;
  const bestLap = telemetry.telemetry.lapData.bestLap;
  const lapTimeDisplay = bestLap ? convertSecondsToTime(bestLap.value) : "-";

  const trackName = extractMetadataValue(metaData, "TrackName") || "Unknown Track";
  const carModel = telemetry.carModel || "Unknown Car Model";
  const driverName = extractMetadataValue(metaData, "DriverName") || null;

  const handleCardClick = () => {
    setOpen(true);
  }

  return <>
    <Card
      className="group/card hover:ring-primary/30 cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardContent className="pt-4 px-4 pb-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base text-foreground truncate">
              {carModel || "Unknown Car"}
            </div>
            <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
              {telemetry.uploaderName && (
                <div>
                  Uploaded by <span className="font-medium text-foreground">{telemetry.uploaderName}</span>
                </div>
              )}
              {driverName && (
                <div>
                  Driven by {driverName}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-primary font-semibold">
              {lapTimeDisplay}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{timeAgo}</div>
          </div>
        </div>

        {trackName && (
          <div className="flex items-center gap-2 text-sm">
            <Map className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">
              {trackName}
            </span>
          </div>
        )}

        {telemetry.driverNote && (
          <p className="text-sm text-muted-foreground line-clamp-2 italic">
            "{telemetry.driverNote}"
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {telemetry.visibility === "private" && (
            <PillBadge text="Private" color="neutral" mode="default" />
          )}
          {telemetry.visibility === "teams-only" && (
            <PillBadge text="Teams" color="primary" mode="default" />
          )}
          <PillBadge text="Verified" color="lime" mode="default" />
        </div>
      </CardContent>
    </Card>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>
          <DialogDescription>
            Grab your generated telemetry file and drop it here!
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <TelemetryDataDisplay metadata={metaData} bestLap={bestLap} setup={setup} />
        </div>

      </DialogContent>
    </Dialog>
  </>
}
