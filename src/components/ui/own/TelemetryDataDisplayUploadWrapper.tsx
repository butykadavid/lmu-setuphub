"use client";

import type {
  TelemetryParseResult,
  TelemetryUploadPayload,
} from "@/lib/telemetry/types";

import { TelemetryDataDisplay } from "@/components/ui/own/TelemetryDataDisplay";
import { TelemetryDataUploadForm } from "@/components/ui/own/TelemetryDataUploadForm";

type TelemetryDataDisplayUploadWrapperProps = {
  data: TelemetryParseResult;
  isUploading: boolean;
  onSubmitUpload: (payload: TelemetryUploadPayload) => Promise<void>;
};

export function TelemetryDataDisplayUploadWrapper({
  data,
  isUploading,
  onSubmitUpload,
}: TelemetryDataDisplayUploadWrapperProps) {
  return (
    <div className="space-y-4">
      <TelemetryDataDisplay data={data} />
      <TelemetryDataUploadForm
        metadata={data.metadata}
        bestLapTelemetry={data.bestLapTelemetry}
        setup={data.setup}
        isUploading={isUploading}
        onSubmitUpload={onSubmitUpload}
      />
    </div>
  );
}
