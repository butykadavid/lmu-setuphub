"use client";

import { useMemo } from "react";

import { Car, Cloud, Clock, Flag, MapPinned, Route, Wrench, Timer } from "lucide-react";

import { convertSecondsToTime, extractMetadataValue } from "@/lib/functions";
import type {
  BestLapItem,
  GroupedSetup,
  MetadataItem,
} from "@/lib/telemetry/types";
import {
  mapSetupToScreenTabs,
  type SetupScreenTab,
} from "@/lib/telemetry/setup-screen";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PillBadge } from "@/components/ui/own/PillBadge";
import InfoTile from "@/components/ui/own/InfoTile";

type TelemetryDataDisplayProps = {
  metadata: MetadataItem[];
  bestLap: BestLapItem;
  setup: GroupedSetup;
};

function getMeta(metadata: MetadataItem[], key: string) {
  return extractMetadataValue(metadata, key) ?? "Unknown";
}

export function TelemetryDataDisplay({
  metadata,
  bestLap,
  setup,
}: TelemetryDataDisplayProps) {
  const trackName = getMeta(metadata, "TrackName");
  const trackLayout = getMeta(metadata, "TrackLayout");
  const carClass = getMeta(metadata, "CarClass");
  const carName = getMeta(metadata, "CarName");
  const weather = getMeta(metadata, "WeatherConditions");
  const sessionTime = getMeta(metadata, "SessionTime");
  const sessionType = getMeta(metadata, "SessionType");
  const version = getMeta(metadata, "Version");
  const bestLapTime = convertSecondsToTime(bestLap.value);

  const setupTabs: SetupScreenTab[] = mapSetupToScreenTabs(setup, carClass);

  const totalSetupValues = setupTabs.reduce(
    (total, tab) => total + tab.sections.reduce((sectionTotal, section) => sectionTotal + section.items.length, 0),
    0
  );

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-black tracking-tight">
              Telemetry detected
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Review the extracted session details before publishing.
            </p>
          </div>

          <PillBadge
            text={`LMU telemetry v${version}`}
            className="bg-primary/10 text-primary hover:bg-primary/10"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pb-0">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <InfoTile icon={<MapPinned />} label="Track" value={trackName} />
          <InfoTile icon={<Route />} label="Layout" value={trackLayout} />
          <InfoTile icon={<Car />} label="Car class" value={carClass} />
          <InfoTile icon={<Wrench />} label="Entry / car name" value={carName} />
          <InfoTile icon={<Cloud />} label="Weather" value={weather} />
          <InfoTile icon={<Clock />} label="Session time" value={sessionTime} />
          <InfoTile icon={<Flag />} label="Session type" value={sessionType} />
          <InfoTile icon={<Timer />} label="Best lap time" value={bestLapTime} />
        </div>

        {setupTabs.length > 0 && (
          <section className="space-y-3 border-t border-border/70 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Setup details</h3>
                <p className="text-xs text-muted-foreground">
                  Grouped to mirror the in-game setup tabs for this car category.
                </p>
              </div>
              <PillBadge
                text={`${totalSetupValues} values`}
                className="bg-secondary text-secondary-foreground"
              />
            </div>

            <Tabs defaultValue={setupTabs[0]?.id} className="gap-3">
              <TabsList
                className="h-auto w-full flex-wrap justify-start gap-1 rounded-none bg-transparent p-0 pb-1"
              >
                {setupTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="h-8 rounded-md border border-border/70 bg-background/40 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] data-active:border-border data-active:bg-background/80"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {setupTabs.map((tab) => (
                <TabsContent
                  key={tab.id}
                  value={tab.id}
                  className="rounded-lg border border-border bg-background/50 p-3"
                >
                  <div className="space-y-3">
                    {tab.sections.map((section) => (
                      <div key={section.id} className="rounded-lg border border-border/60 bg-background/60 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {section.label}
                          </h4>
                          <span className="text-[11px] text-muted-foreground">
                            {section.items.length}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {section.items.map((item) => (
                            <div
                              key={item.key}
                              className={`flex items-start justify-between gap-3 rounded-md px-2 py-1.5 ${
                                item.isDisabled ? "bg-muted/40 opacity-45" : "bg-background/70"
                              }`}
                            >
                              <span className="min-w-0 text-xs text-muted-foreground">
                                {item.label}
                              </span>
                              <span className="shrink-0 text-right text-xs font-medium text-foreground">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
