import { NextRequest } from "next/server";

import {
  authErrorResponse,
  authSuccessResponse,
  isAuthError,
  verifyBearerAuthToken,
} from "@/lib/firebase/api-middleware";
import { adminDb } from "@/lib/firebase/admin";
import type {
  LapTelemetry,
  GroupedSetup,
  MetadataItem,
  TelemetryUploadPayload,
} from "@/lib/telemetry/types";

function getMetaValue(metadata: MetadataItem[], key: string) {
  return metadata.find((item) => item.key === key)?.value ?? null;
}

function sanitizeMetadata(metadata: MetadataItem[]) {
  return metadata.filter((item) => item.key.toLowerCase() !== "steamid");
}

function isMetadataList(value: unknown): value is MetadataItem[] {
  return Array.isArray(value) && value.every((item) => {
    return typeof item === "object"
      && item !== null
      && typeof item.key === "string"
      && typeof item.value === "string";
  });
}

function isLapTelemetry(value: unknown): value is LapTelemetry {
  return typeof value === "object"
    && value !== null
    && typeof (value as any).lapStartTs === "number"
    && typeof (value as any).lapEndTs === "number"
    && typeof (value as any).lapTime === "number"
    && Array.isArray((value as any).throttle)
    && Array.isArray((value as any).brake)
    && Array.isArray((value as any).speed)
    && Array.isArray((value as any).gears);
}

function isGroupedSetup(value: unknown): value is GroupedSetup {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTelemetryVisibility(value: unknown): value is TelemetryUploadPayload["visibility"] {
  return value === "public" || value === "private" || value === "teams-only";
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
    && isTelemetryVisibility(payload.visibility)
    && isMetadataList(payload.metadata)
    && isLapTelemetry(payload.bestLapTelemetry)
    && isGroupedSetup(payload.setup);
}

export async function POST(request: NextRequest) {
  const auth = await verifyBearerAuthToken(request);
  if (isAuthError(auth)) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      const parseError = err instanceof Error ? err.message : "Unknown parse error";
      console.error("JSON parse error:", parseError);
      return authErrorResponse(`Invalid JSON: ${parseError}`, 400);
    }

    if (!isTelemetryUploadPayload(body)) {
      console.warn("Invalid payload structure received");
      return authErrorResponse("Invalid telemetry upload payload", 400);
    }

    const {
      selectedCarId,
      selectedCarName,
      driverNote,
      carConfirmed,
      dataConfirmed,
      visibility,
      metadata,
      bestLapTelemetry,
      setup,
    } = body;
    const sanitizedMetadata = sanitizeMetadata(metadata);

    if (!selectedCarId.trim() || !selectedCarName.trim()) {
      return authErrorResponse("A confirmed car selection is required", 400);
    }

    if (!carConfirmed || !dataConfirmed) {
      return authErrorResponse("Car and data confirmations are required", 400);
    }

    if (sanitizedMetadata.length === 0) {
      return authErrorResponse("Telemetry metadata is required", 400);
    }

    // const telemetryDoc = {
    //   userId: auth.uid,
    //   selectedCar: {
    //     id: selectedCarId.trim(),
    //     name: selectedCarName.trim(),
    //   },
    //   driverNote: driverNote.trim(),
    //   confirmations: {
    //     car: carConfirmed,
    //     data: dataConfirmed,
    //   },
    //   visibility,
    //   version: getMetaValue(sanitizedMetadata, "Version") || -1,
    //   telemetry: {
    //     metadata: sanitizedMetadata,
    //     lapData: {
    //       bestLapTelemetry: bestLapTelemetry,
    //       laps: [], // For now we only require best lap data, full lap data can be added in the future if needed
    //     },
    //     setup,
    //   },
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    // const docRef = await adminDb.collection("telemetryUploads").add(telemetryDoc);

    const uploadDoc = {
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
      visibility,
      version: getMetaValue(sanitizedMetadata, "Version") || -1,
      telemetry: {
        metadata: sanitizedMetadata,
        bestLap: {
          lapTime: bestLapTelemetry.lapTime,
        },
        setup,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "incomplete" // This can be updated to "complete" once all related data is successfully written
    };

    const docRef = await adminDb
      .collection("telemetryUploads")
      .add(uploadDoc);

    await adminDb
      .collection("telemetryUploads")
      .doc(docRef.id)
      .collection("channels")
      .doc("throttle")
      .set({
        values: bestLapTelemetry.throttle.map((point) => (
          {
            lapTime: point.lapTime.toFixed(4),
            value: point.value.toFixed(3)
          }
        )),
      });

    await adminDb
      .collection("telemetryUploads")
      .doc(docRef.id)
      .collection("channels")
      .doc("brake")
      .set({
        values: bestLapTelemetry.brake.map((point) => (
          {
            lapTime: point.lapTime.toFixed(4),
            value: point.value.toFixed(3)
          }
        )),
      });

    await adminDb
      .collection("telemetryUploads")
      .doc(docRef.id)
      .collection("channels")
      .doc("lapDist")
      .set({
        values: bestLapTelemetry.lapDist.map((point) => ({
          lapTime: point.lapTime.toFixed(4),
          value: point.value.toFixed(3)
        })),
      });

    await adminDb
      .collection("telemetryUploads")
      .doc(docRef.id)
      .collection("channels")
      .doc("speed")
      .set({
        values: bestLapTelemetry.speed.map((point) => ({
          lapTime: point.lapTime.toFixed(4),
          value: point.value.toFixed(3)
        })),
      });

    await adminDb
      .collection("telemetryUploads")
      .doc(docRef.id)
      .collection("channels")
      .doc("gears")
      .set({
        values: bestLapTelemetry.gears,
      });

    await adminDb
      .collection("telemetryUploads")
      .doc(docRef.id)
      .collection("channels")
      .doc("gpsCoords")
      .set({
        values: bestLapTelemetry.gpsCoords,
      });

    await docRef.update({ status: "complete" });

    return authSuccessResponse({
      message: "Telemetry uploaded successfully",
      telemetryId: docRef.id,
    }, 201);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";

    console.error("Telemetry Upload Error:", {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      type: error instanceof Error ? error.constructor.name : typeof error,
    });

    // Return a more detailed error message for debugging
    return authErrorResponse(
      `Telemetry upload failed: ${errorMessage}`,
      500
    );
  }
}