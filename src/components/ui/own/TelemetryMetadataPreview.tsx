import { Car, Cloud, Clock, Flag, MapPinned, Route, Wrench, Timer } from "lucide-react";

import { convertSecondsToTime } from "@/lib/functions";
import type { SetupCategory } from "@/lib/telemetry/noramlize-setup";
import type {
  BestLapItem,
  GroupedSetup,
  MetadataItem,
} from "@/lib/telemetry/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PillBadge } from "@/components/ui/own/PillBadge";
import InfoTile from "@/components/ui/own/InfoTile";

type TelemetryMetadataPreviewProps = {
  metadata: MetadataItem[];
  bestLaps: BestLapItem[];
  setup: GroupedSetup;
};

const SETUP_CATEGORY_LABELS: Record<SetupCategory, string> = {
  electronics: "Electronics",
  brakes: "Brakes",
  aero: "Aero",
  suspension: "Suspension",
  wheels: "Wheels",
  drivetrain: "Drivetrain",
  engine: "Engine",
  strategy: "Strategy",
  misc: "Misc",
};

const SETUP_CATEGORY_ORDER: SetupCategory[] = [
  "electronics",
  "brakes",
  "aero",
  "suspension",
  "wheels",
  "drivetrain",
  "engine",
  "strategy",
  "misc",
];

function getMeta(metadata: MetadataItem[], key: string) {
  return metadata.find((item) => item.key === key)?.value ?? "-";
}

function isMeaningfulSetupValue(value: string) {
  return (
    !!value &&
    value !== "Standard" &&
    value !== "Fixed" &&
    value !== "Non-adjustable"
  );
}

export function TelemetryMetadataPreview({
  metadata,
  bestLaps,
  setup,
}: TelemetryMetadataPreviewProps) {
  const trackName = getMeta(metadata, "TrackName");
  const trackLayout = getMeta(metadata, "TrackLayout");
  const carClass = getMeta(metadata, "CarClass");
  const carName = getMeta(metadata, "CarName");
  const weather = getMeta(metadata, "WeatherConditions");
  const sessionTime = getMeta(metadata, "SessionTime");
  const sessionType = getMeta(metadata, "SessionType");
  const version = getMeta(metadata, "Version");
  const bestLapTime = convertSecondsToTime(
    Number(bestLaps.filter((row) => Number(row.value) > 0)[0]?.value ?? 0)
  );
  const setupSections = SETUP_CATEGORY_ORDER
    .map((category) => ({
      category,
      label: SETUP_CATEGORY_LABELS[category],
      items: setup[category].filter((item) => isMeaningfulSetupValue(item.value)),
    }))
    .filter((section) => section.items.length > 0);

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

      <CardContent className="space-y-4 p-4">
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

        {setupSections.length > 0 && (
          <section className="space-y-3 border-t border-border/70 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Setup details</h3>
                <p className="text-xs text-muted-foreground">
                  Categorized car setup values extracted from the telemetry file.
                </p>
              </div>
              <PillBadge
                text={`${setupSections.reduce((total, section) => total + section.items.length, 0)} values`}
                className="bg-secondary text-secondary-foreground"
              />
            </div>

            <Tabs defaultValue={setupSections[0]?.category} className="gap-0">
              <TabsList
                className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none bg-transparent p-0 pb-1"
              >
                {setupSections.map((section) => (
                  <TabsTrigger
                    key={section.category}
                    value={section.category}
                    className="h-auto mb-1 flex-none rounded-md px-3 text-xs font-semibold uppercase tracking-[0.14em] data-active:bg-background/70"
                  >
                    {section.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {setupSections.map((section) => (
                <TabsContent
                  key={section.category}
                  value={section.category}
                  className="rounded-lg border border-border bg-background/50 p-3"
                >
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {section.label}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground/80">
                      {section.items.length} setup values
                    </p>
                  </div>

                  <div className="grid gap-1.5 md:grid-cols-2">
                    {section.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-start justify-between gap-3 rounded-md bg-background/70 px-2 py-1.5"
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
                </TabsContent>
              ))}
            </Tabs>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
