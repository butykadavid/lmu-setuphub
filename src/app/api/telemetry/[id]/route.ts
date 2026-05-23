import { NextRequest } from "next/server";
import {
  authErrorResponse,
  authSuccessResponse,
  isAuthError,
  verifyBearerAuthToken,
} from "@/lib/firebase/api-middleware";
import { adminDb } from "@/lib/firebase/admin";

type ChannelDoc = {
  sampleRate?: number;
  values?: number[];
};

function toIsoDate(value: any) {
  if (!value) return new Date().toISOString();

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return new Date().toISOString();
}

function valuesToTelemetryPoints(values: any[] = []) {
  return values.map((item, index) => {
    if (typeof item === "number") {
      return {
        lapTime: index,
        value: item,
      };
    }

    return {
      lapTime: item.lapTime,
      value: item.value,
    };
  });
}

async function loadChannel(uploadId: string, channelName: string) {
  const snap = await adminDb
    .collection("telemetryUploads")
    .doc(uploadId)
    .collection("channels")
    .doc(channelName)
    .get();

  if (!snap.exists) {
    return [];
  }

  const data = snap.data() as ChannelDoc;
  return valuesToTelemetryPoints(data.values ?? []);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyBearerAuthToken(request);

  if (isAuthError(auth)) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;

    const uploadSnap = await adminDb
      .collection("telemetryUploads")
      .doc(id)
      .get();

    if (!uploadSnap.exists) {
      return authErrorResponse("Telemetry upload not found", 404);
    }

    const data = uploadSnap.data();

    if (!data) {
      return authErrorResponse("Telemetry upload has no data", 404);
    }

    if (data.status !== "complete") {
      return authErrorResponse("Telemetry upload is not complete", 409);
    }

    const isOwner = data.userId === auth.uid;
    const isPublic =
      data.visibility === "public" || data.visibility === "teams-only";

    if (!isOwner && !isPublic) {
      return authErrorResponse("You do not have access to this upload", 403);
    }

    const [throttle, brake, steering, speed, gears, lapDist, gpsCoords] =
      await Promise.all([
        loadChannel(id, "throttle"),
        loadChannel(id, "brake"),
        loadChannel(id, "steering"),
        loadChannel(id, "speed"),
        loadChannel(id, "gears"),
        loadChannel(id, "lapDist"),
        loadGpsChannel(id),
      ]);

    async function loadGpsChannel(uploadId: string) {
      const snap = await adminDb
        .collection("telemetryUploads")
        .doc(uploadId)
        .collection("channels")
        .doc("gpsCoords")
        .get();

      if (!snap.exists) return [];

      const data = snap.data() as any;
      const values = data.values ?? [];

      return values.map((item: any, index: number) => ({
        lapTime: item.lapTime ?? item.laptime ?? index / (data.sampleRate ?? 50),
        sessionTime: item.sessionTime ?? item.sessiontime ?? item.lapTime ?? item.laptime ?? index / (data.sampleRate ?? 50),
        value: {
          latitude: item.value?.latitude ?? item.latitude,
          longitude: item.value?.longitude ?? item.longitude,
          trackEdge: item.value?.trackEdge ?? item.trackEdge,
          pathLateral: item.value?.pathLateral ?? item.pathLateral,
        }
      }));
    }

    const responseData = {
      id: uploadSnap.id,
      userId: data.userId ?? "",
      selectedCar: data.selectedCar ?? null,
      driverNote: data.driverNote ?? "",
      visibility: data.visibility ?? "private",
      createdAt: toIsoDate(data.createdAt),
      updatedAt: toIsoDate(data.updatedAt),

      metadata: data.telemetry?.metadata ?? [],

      setup: data.telemetry?.setup ?? {},

      bestLapTelemetry: {
        lapStartTs: data.telemetry?.bestLap?.lapStartTs ?? 0,
        lapEndTs: data.telemetry?.bestLap?.lapEndTs ?? 0,
        lapTime: data.telemetry?.bestLap?.lapTime ?? 0,

        throttle,
        brake,
        steering,
        speed,
        gears,
        lapDist,
        gpsCoords,
      },
    };

    return authSuccessResponse(responseData);
  } catch (error) {
    console.error("Error loading telemetry upload:", error);

    return authErrorResponse(
      `Failed to load telemetry upload: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
}