"use client";

import { useState } from "react";

import { Car, Cloud, Clock, Flag, MapPinned, Route, Wrench, Timer } from "lucide-react";

import { convertSecondsToTime } from "@/lib/functions";
import {
  findMatchingCarId,
  getCarsForClass,
  type TelemetryCarRosterEntry,
} from "@/lib/telemetry/carDictionary";
import type {
  BestLapItem,
  GroupedSetup,
  MetadataItem,
} from "@/lib/telemetry/types";
import {
  mapSetupToScreenTabs,
  type SetupScreenTab,
} from "../../../lib/telemetry/setup-screen";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PillBadge } from "@/components/ui/own/PillBadge";
import InfoTile from "@/components/ui/own/InfoTile";
import type { TelemetryUploadPayload } from "@/lib/telemetry/types";

type TelemetryMetadataPreviewProps = {
  metadata: MetadataItem[];
  bestLap: BestLapItem;
  setup: GroupedSetup;
  isUploading: boolean;
  onSubmitUpload: (payload: TelemetryUploadPayload) => Promise<void>;
};

function getMeta(metadata: MetadataItem[], key: string) {
  return metadata.find((item) => item.key === key)?.value ?? "-";
}

export function TelemetryMetadataPreview({
  metadata,
  bestLap,
  setup,
  isUploading,
  onSubmitUpload,
}: TelemetryMetadataPreviewProps) {
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
  const availableCars: TelemetryCarRosterEntry[] = getCarsForClass(carClass);
  const [selectedCarId, setSelectedCarId] = useState(() => findMatchingCarId(carName, availableCars));
  const [driverNote, setDriverNote] = useState("");
  const [carConfirmed, setCarConfirmed] = useState(false);
  const [dataConfirmed, setDataConfirmed] = useState(false);

  const selectedCar = availableCars.find((car) => car.id === selectedCarId);
  const canUpload = Boolean(selectedCar) && carConfirmed && dataConfirmed && !isUploading;
  const totalSetupValues = setupTabs.reduce(
    (total, tab) => total + tab.sections.reduce((sectionTotal, section) => sectionTotal + section.items.length, 0),
    0
  );

  async function handleUpload() {
    if (!selectedCar) {
      return;
    }

    await onSubmitUpload({
      metadata,
      bestLap,
      setup,
      selectedCarId: selectedCar.id,
      selectedCarName: selectedCar.name,
      driverNote,
      carConfirmed,
      dataConfirmed,
    });
  }

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
                              className={`flex items-start justify-between gap-3 rounded-md px-2 py-1.5 ${item.isDisabled
                                ? "bg-muted/40 opacity-45"
                                : "bg-background/70"
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

        <section className="space-y-3 border-t border-border/70 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Submission details</h3>
              <p className="text-xs text-muted-foreground">
                Add a short note and select the exact car for this telemetry upload.
              </p>
            </div>
          </div>

          <FieldGroup className="flex flex-row gap-4">
            <Field>
              <FieldLabel htmlFor="telemetry-car-select">Car</FieldLabel>
              <InfoTile icon={<Wrench />} label="Entry/Car name" value={carName} />
              <Select
                value={selectedCarId}
                onValueChange={(value) => {
                  setSelectedCarId(value);
                  setCarConfirmed(false);
                }}
              >
                <SelectTrigger id="telemetry-car-select" className="h-10 w-full">
                  <SelectValue placeholder={`Select a car from the ${carClass} roster`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cars</SelectLabel>
                    {availableCars.map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        <span className="h-2 w-2 inline-block rounded-xs" style={{ backgroundColor: car.color }}></span>{car.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                As currently there are no exposed data points by the game to reliably identify the exact car used, this selection is required to ensure the telemetry is associated with the correct car in our database. The system will attempt to match the car name from the telemetry to the roster, but please verify and adjust if necessary.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="telemetry-driver-note">Driver note</FieldLabel>
              <textarea
                id="telemetry-driver-note"
                value={driverNote}
                onChange={(event) => setDriverNote(event.target.value)}
                placeholder="Add context about the setup, driving style, track conditions, or what changed in this session."
                className="min-h-28 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
              <FieldDescription>
                Use this for notes that should travel with the upload, like setup intent or lap context.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </section>

        <section className="flex gap-4">
          <div className={`${!selectedCar && "opacity-50 pointer-events-none"} mt-3 rounded-lg border border-border/70 bg-muted/30 p-3 w-1/2`}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              Car confirmation required
            </p>

            <label htmlFor="confirm-selected-car" className="flex cursor-pointer items-start gap-2">
              <input
                id="confirm-selected-car"
                type="checkbox"
                checked={carConfirmed}
                onChange={(event) => {
                  const nextValue = event.target.checked;
                  setCarConfirmed(nextValue);
                }}
                className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
              />
              <span className="text-xs text-muted-foreground">
                I confirm the telemetry was recorded with {selectedCar?.name}.
              </span>
            </label>

            <p className={`mt-2 text-xs ${carConfirmed ? "text-primary" : "text-muted-foreground"}`}>
              {carConfirmed
                ? "Car verification complete."
                : "Please complete the check to verify the selected car."}
            </p>
          </div>

          <div className={`${(!metadata || !setup) && "opacity-50 pointer-events-none"} mt-3 rounded-lg border border-border/70 bg-muted/30 p-3 w-1/2`}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              Data validity confirmation required
            </p>

            <label htmlFor="confirm-data-validity" className="flex cursor-pointer items-start gap-2">
              <input
                id="confirm-data-validity"
                type="checkbox"
                checked={dataConfirmed}
                onChange={(event) => {
                  const nextValue = event.target.checked;
                  setDataConfirmed(nextValue);
                }}
                className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
              />
              <span className="text-xs text-muted-foreground">
                I confirm that the telemetry analysis and extracted details are correct based on my review.
              </span>
            </label>

            <p className={`mt-2 text-xs ${dataConfirmed ? "text-primary" : "text-muted-foreground"}`}>
              {dataConfirmed
                ? "Data verification complete."
                : "Please complete the check to verify the data."}
            </p>
          </div>

        </section>

        <section className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Ready to upload telemetry data</p>
            <p className="text-xs text-muted-foreground">
              Upload stays disabled until the selected car and extracted data are both confirmed.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={!canUpload}
            className="min-w-44"
          >
            {isUploading ? "Uploading telemetry..." : "Upload telemetry data"}
          </Button>
        </section>
      </CardContent>
    </Card>
  );
}
