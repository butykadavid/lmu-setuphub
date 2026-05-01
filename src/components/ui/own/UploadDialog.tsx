"use client";

import { useState } from "react";

import { inspectDuckDbFile } from "@/lib/telemetry/parse-duckdb-browser";

import FileUploader from "@/components/ui/own/FileUploader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TelemetryMetadataPreview,
} from "@/components/ui/own/TelemetryMetadataPreview";
import type { TelemetryParseResult } from "@/lib/telemetry/types";


type UploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TelemetryParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesSelected(files: File[]) {
    const file = files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const parsed = await inspectDuckDbFile(file);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>
          <DialogDescription>
            Grab your generated telemetry file and drop it here!
          </DialogDescription>
        </DialogHeader>
        <FileUploader onFilesSelected={handleFilesSelected} />

        {loading && (
          <p className="mt-2 text-muted-foreground">Inspecting DuckDB file...</p>
        )}

        {error && <p className="mt-2 text-destructive">{error}</p>}

        {result && (
          <div className="mt-2">
            <TelemetryMetadataPreview
              metadata={result.metadata}
              bestLaps={result.bestLaps}
              setup={result.setup}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
