import { NextRequest } from "next/server";

import {
  authErrorResponse,
  authSuccessResponse,
  isAuthError,
  verifyBearerAuthToken,
} from "@/lib/firebase/api-middleware";
import { adminDb } from "@/lib/firebase/admin";
import type {
  BestLapItem,
  GroupedSetup,
  MetadataItem,
  TelemetryUploadPayload,
} from "@/lib/telemetry/types";

function getMetaValue(metadata: MetadataItem[], key: string) {
  return metadata.find((item) => item.key === key)?.value ?? null;
}

function isMetadataList(value: unknown): value is MetadataItem[] {
  return Array.isArray(value) && value.every((item) => {
    return typeof item === "object"
      && item !== null
      && typeof item.key === "string"
      && typeof item.value === "string";
  });
}

function isBestLapItem(value: unknown): value is BestLapItem {
  return typeof value === "object"
    && value !== null
    && typeof (value as any).ts === "number"
    && typeof (value as any).value === "number";
}

function isGroupedSetup(value: unknown): value is GroupedSetup {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTelemetryUploadPayload(value: unknown): value is TelemetryUploadPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Partial<TelemetryUploadPayload>;

  return typeof payload.selectedCarId === "string"
    && typeof payload.selectedCarName === "string"
    && typeof payload.driverNote === "string"
    && typeof payload.carConfirmed === "boolean"
    && typeof payload.dataConfirmed === "boolean"
    && isMetadataList(payload.metadata)
    && isBestLapItem(payload.bestLap)
    && isGroupedSetup(payload.setup);
}

export async function POST(request: NextRequest) {
  const auth = await verifyBearerAuthToken(request);
  if (isAuthError(auth)) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const body: unknown = await request.json();

    if (!isTelemetryUploadPayload(body)) {
      return authErrorResponse("Invalid telemetry upload payload", 400);
    }

    const {
      selectedCarId,
      selectedCarName,
      driverNote,
      carConfirmed,
      dataConfirmed,
      metadata,
      bestLap,
      setup,
    } = body;

    if (!selectedCarId.trim() || !selectedCarName.trim()) {
      return authErrorResponse("A confirmed car selection is required", 400);
    }

    if (!carConfirmed || !dataConfirmed) {
      return authErrorResponse("Car and data confirmations are required", 400);
    }

    if (metadata.length === 0) {
      return authErrorResponse("Telemetry metadata is required", 400);
    }

    const telemetryDoc = {
      userId: auth.uid,
      selectedCar: {
        id: selectedCarId.trim(),
        name: selectedCarName.trim(),
      },
      driverNote: driverNote.trim(),
      confirmations: {
        car: carConfirmed,
        data: dataConfirmed,
      },
      summary: {
        trackName: getMetaValue(metadata, "TrackName"),
        trackLayout: getMetaValue(metadata, "TrackLayout"),
        carClass: getMetaValue(metadata, "CarClass"),
        carName: getMetaValue(metadata, "CarName"),
        weatherConditions: getMetaValue(metadata, "WeatherConditions"),
        sessionTime: getMetaValue(metadata, "SessionTime"),
        sessionType: getMetaValue(metadata, "SessionType"),
        version: getMetaValue(metadata, "Version"),
      },
      telemetry: {
        metadata,
        bestLap,
        setup,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection("telemetryUploads").add(telemetryDoc);

    return authSuccessResponse({
      message: "Telemetry uploaded successfully",
      telemetryId: docRef.id,
    }, 201);
  } catch (error) {
    console.error("Error uploading telemetry:", error);
    return authErrorResponse("Failed to upload telemetry", 500);
  }
}