"use client";

import type {
  BestLapItem,
  GroupedSetup,
  MetadataItem,
  TelemetryUploadPayload,
} from "@/lib/telemetry/types";

import { TelemetryDataDisplay } from "@/components/ui/own/TelemetryDataDisplay";
import { TelemetryDataUploadForm } from "@/components/ui/own/TelemetryDataUploadForm";

type TelemetryDataDisplayUploadWrapperProps = {
  metadata: MetadataItem[];
  bestLap: BestLapItem;
  setup: GroupedSetup;
  isUploading: boolean;
  onSubmitUpload: (payload: TelemetryUploadPayload) => Promise<void>;
};

export function TelemetryDataDisplayUploadWrapper({
  metadata,
  bestLap,
  setup,
  isUploading,
  onSubmitUpload,
}: TelemetryDataDisplayUploadWrapperProps) {
  return (
    <div className="space-y-4">
      <TelemetryDataDisplay metadata={metadata} bestLap={bestLap} setup={setup} />
      <TelemetryDataUploadForm
        metadata={metadata}
        bestLap={bestLap}
        setup={setup}
        isUploading={isUploading}
        onSubmitUpload={onSubmitUpload}
      />
    </div>
  );
}
