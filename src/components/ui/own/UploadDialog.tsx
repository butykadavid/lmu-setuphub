"use client";

import { useState } from "react";

import { inspectDuckDbFile } from "@/lib/telemetry/parse-duckdb-browser";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { authorizedJsonFetch } from "../../../lib/firebase/authenticated-fetch";

import FileUploader from "@/components/ui/own/FileUploader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TelemetryDataDisplayUploadWrapper
} from "@/components/ui/own/TelemetryDataDisplayUploadWrapper";
import type {
  TelemetryParseResult,
  TelemetryUploadPayload,
  TelemetryUploadResponse,
} from "@/lib/telemetry/types";


type UploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const { user } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TelemetryParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  function resetDialogState() {
    setLoading(false);
    setResult(null);
    setError(null);
    setUploading(false);
    setUploadError(null);
    setUploadSuccess(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetDialogState();
    }

    onOpenChange(nextOpen);
  }

  async function handleFilesSelected(files: File[]) {
    const file = files[0];
    if (!file) return;

    startLoading("file-parse", "default", "Parsing telemetry file...");
    setError(null);
    setResult(null);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const parsed = await inspectDuckDbFile(file);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setLoading(false);
      stopLoading("file-parse");
    }
  }

  async function handleSubmitUpload(payload: TelemetryUploadPayload) {
    startLoading("telemetry-upload", "upload", "Uploading telemetry data...");
    setUploadError(null);
    setUploadSuccess(null);
    setUploading(true);

    try {
      if (!user) {
        throw new Error("You must be signed in to upload telemetry");
      }

      const response = await authorizedJsonFetch(user, "/api/telemetry", {
        method: "POST",
        body: payload,
      });

      const body = await response.json() as TelemetryUploadResponse | { error?: string };

      if (!response.ok) {
        const errorMsg = ("error" in body && body.error) ? body.error : "Failed to upload telemetry";
        console.error("Upload failed with status", response.status, ":", errorMsg);
        throw new Error(errorMsg);
      }

      if (!("message" in body)) {
        throw new Error("Unexpected upload response structure");
      }

      setUploadSuccess(body.message);
      onOpenChange(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unknown error occurred during upload";
      console.error("Telemetry upload error:", {
        error: err,
        message: errorMsg,
        timestamp: new Date().toISOString(),
      });
      setUploadError(errorMsg);
    } finally {
      setUploading(false);
      stopLoading("telemetry-upload");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

        {uploadError && <p className="mt-2 text-destructive">{uploadError}</p>}

        {uploadSuccess && <p className="mt-2 text-primary">{uploadSuccess}</p>}

        {result && (
          <div className="mt-2">
            <TelemetryDataDisplayUploadWrapper
              data={result}
              isUploading={uploading}
              onSubmitUpload={handleSubmitUpload}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
