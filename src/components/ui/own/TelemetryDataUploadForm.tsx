"use client";

import { useMemo, useState } from "react";

import { Wrench } from "lucide-react";

import { findMatchingCarId, getCarsForClass, type TelemetryCarRosterEntry } from "@/lib/telemetry/carDictionary";
import type { GroupedSetup, LapTelemetry, MetadataItem, TelemetryUploadPayload } from "@/lib/telemetry/types";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/togglegroup";
import InfoTile from "@/components/ui/own/InfoTile";

type TelemetryDataUploadFormProps = {
  metadata: MetadataItem[];
  bestLapTelemetry: LapTelemetry;
  setup: GroupedSetup;
  isUploading: boolean;
  onSubmitUpload: (payload: TelemetryUploadPayload) => Promise<void>;
};

function getMeta(metadata: MetadataItem[], key: string) {
  return metadata.find((item) => item.key === key)?.value ?? "-";
}

export function TelemetryDataUploadForm({
  metadata,
  bestLapTelemetry,
  setup,
  isUploading,
  onSubmitUpload,
}: TelemetryDataUploadFormProps) {
  const carClass = getMeta(metadata, "CarClass");
  const carName = getMeta(metadata, "CarName");

  const availableCars: TelemetryCarRosterEntry[] = getCarsForClass(carClass);

  const [selectedCarId, setSelectedCarId] = useState(() =>
    findMatchingCarId(carName, availableCars)
  );
  const [driverNote, setDriverNote] = useState("");

  const [carConfirmed, setCarConfirmed] = useState(false);
  const [dataConfirmed, setDataConfirmed] = useState(false);

  const [visibility, setVisibility] = useState<"public" | "private" | "teams-only">("public");

  const selectedCar = availableCars.find((car) => car.id === selectedCarId);
  const canUpload = Boolean(selectedCar) && carConfirmed && dataConfirmed && !isUploading;

  const selectedCarBoxStyle = useMemo(() => {
    if (!selectedCar) {
      return {
        className:
          "relative flex flex-col justify-between opacity-50 pointer-events-none mt-3 rounded-lg border border-border/70 bg-muted/30 p-3 w-1/2",
        style: {},
      };
    }

    return {
      className: "relative flex flex-col justify-between mt-3 rounded-lg border-2 border-border/70 p-3 w-1/2",
      style: { backgroundColor: `${selectedCar.color}4d`, borderColor: `${selectedCar.color}4d` }, // 4d = ~30% opacity
    };
  }, [selectedCar]);

  async function handleUpload() {
    if (!selectedCar) {
      return;
    }

    await onSubmitUpload({
      metadata,
      setup,
      bestLapTelemetry,
      selectedCarId: selectedCar.id,
      selectedCarName: selectedCar.name,
      driverNote,
      carConfirmed,
      dataConfirmed,
      visibility,
    });
  }

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-black tracking-tight">Submission details</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a short note and select the exact car for this telemetry upload.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pb-0">
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
                      <span
                        className="h-2 w-2 inline-block rounded-xs"
                        style={{ backgroundColor: car.color }}
                      ></span>
                      {car.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              As currently there are no exposed data points by the game to reliably identify the exact
              car used, this selection is required to ensure the telemetry is associated with the
              correct car in our database. The system will attempt to match the car name from the
              telemetry to the roster, but please verify and adjust if necessary.
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

        <section className="flex gap-4">
          <div className={selectedCarBoxStyle.className} style={selectedCarBoxStyle.style}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              Car confirmation required
            </p>

            <FieldGroup className="flex cursor-pointer items-center gap-2">
              <Field orientation="horizontal">
                <Checkbox
                  id="confirm-selected-car"
                  name="confirm-selected-car"
                  checked={carConfirmed}
                  onCheckedChange={() => setCarConfirmed((prev) => !prev)}
                  className="mt-0.5 h-4 w-4 rounded border-input cursor-pointer"
                />
                <Label
                  htmlFor="confirm-selected-car"
                  className="cursor-pointer text-xs text-primary/90"
                >
                  I confirm the telemetry was recorded with {selectedCar?.name}.
                </Label>
              </Field>
            </FieldGroup>

            <p className={`mt-2 text-xs ${carConfirmed ? "text-primary" : "text-muted-foreground"}`}>
              {carConfirmed ? "Car verification complete." : "Please complete the check to verify the selected car."}
            </p>
          </div>

          <div
            className={`${!metadata || !setup ? "opacity-50 pointer-events-none" : ""} flex flex-col justify-between mt-3 rounded-lg border border-border/70 bg-muted/30 p-3 w-1/2`}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              Data validity confirmation required
            </p>

            <FieldGroup className="flex cursor-pointer items-center gap-2">
              <Field orientation="horizontal">
                <Checkbox
                  id="confirm-data-validity"
                  name="confirm-data-validity"
                  checked={dataConfirmed}
                  onCheckedChange={() => setDataConfirmed((prev) => !prev)}
                  className="mt-0.5 h-4 w-4 rounded border-input cursor-pointer"
                />
                <Label
                  htmlFor="confirm-data-validity"
                  className="cursor-pointer text-xs text-primary/90"
                >
                  I confirm the telemetry analysis and extracted details are correct based on my review.
                </Label>
              </Field>
            </FieldGroup>

            <p className={`mt-2 text-xs ${dataConfirmed ? "text-primary" : "text-muted-foreground"}`}>
              {dataConfirmed ? "Data verification complete." : "Please complete the check to verify the data."}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Who can see your setup?</p>
            <p className="text-xs text-muted-foreground">
              Choose to share it with everyone, keep it private, or share only with your teams.
            </p>
          </div>

          <ToggleGroup
            onValueChange={(e) => setVisibility(e as "public" | "private" | "teams-only")}
            variant={"outline"}
            type="single"
            defaultValue="public"
          >
            <ToggleGroupItem value="public">Public</ToggleGroupItem>
            <ToggleGroupItem value="private">Private</ToggleGroupItem>
            <ToggleGroupItem value="teams-only">Teams-only</ToggleGroupItem>
          </ToggleGroup>
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
            className="min-w-44 py-5"
          >
            {isUploading ? "Uploading telemetry..." : "Upload telemetry data"}
          </Button>
        </section>
      </CardContent>
    </Card>
  );
}
