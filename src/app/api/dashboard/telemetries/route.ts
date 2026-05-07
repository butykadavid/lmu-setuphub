import { NextRequest } from "next/server";
import {
  authErrorResponse,
  authSuccessResponse,
  isAuthError,
  verifyBearerAuthToken,
} from "@/lib/firebase/api-middleware";
import { adminDb } from "@/lib/firebase/admin";
import { extractMetadataValue } from "@/lib/functions";

export type TelemetrySummary = {
  id: string;
  userId: string;
  uploaderName: string | null;

  driverNote: string;
  carModel: string;

  trackName: string;
  trackLayout: string;
  carClass: string;
  bestLapMs: number | null;

  telemetry: {
    metadata: any[];
    bestLap?: {
      lapTime?: number;
      lapTimeMs?: number;
    };
  };

  createdAt: string;
  visibility: "public" | "private" | "teams-only";
};

export type BrowseTelemetriesResponse = {
  telemetries: TelemetrySummary[];
  hasMore: boolean;
  cursor?: string;
};

async function getTelemetrySummary(
  doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): Promise<TelemetrySummary> {
  const data = doc.data();

  if (!data) {
    throw new Error(`Document ${doc.id} has no data`);
  }

  let uploaderName: string | null = null;

  if (data.userId) {
    try {
      const userDoc = await adminDb.collection("users").doc(data.userId).get();
      uploaderName = userDoc.data()?.displayName ?? null;
    } catch (error) {
      console.warn(`Error fetching user ${data.userId}:`, error);
    }
  }

  let createdAtString = new Date().toISOString();

  if (data.createdAt) {
    try {
      if (typeof data.createdAt.toDate === "function") {
        createdAtString = data.createdAt.toDate().toISOString();
      } else if (data.createdAt instanceof Date) {
        createdAtString = data.createdAt.toISOString();
      } else if (typeof data.createdAt === "string") {
        createdAtString = data.createdAt;
      }
    } catch (error) {
      console.warn(`Error converting createdAt for doc ${doc.id}:`, error);
    }
  }

  const metadata = data.telemetry?.metadata ?? [];

  const trackName =
    data.trackName ?? extractMetadataValue(metadata, "TrackName") ?? "";

  const trackLayout =
    data.trackLayout ?? extractMetadataValue(metadata, "TrackLayout") ?? "";

  const carClass =
    data.carClass ?? extractMetadataValue(metadata, "CarClass") ?? "";

  const bestLapSeconds =
    data.bestLapSeconds ??
    data.telemetry?.bestLap?.lapTime ??
    data.telemetry?.bestLap?.lapTimeSeconds ??
    null;

  const bestLapMs =
    data.bestLapMs ??
    data.telemetry?.bestLap?.lapTimeMs ??
    (typeof bestLapSeconds === "number"
      ? Math.round(bestLapSeconds * 1000)
      : null);

  return {
    id: doc.id,
    userId: data.userId || "",
    uploaderName,

    driverNote: data.driverNote || "",
    carModel: data.selectedCar?.name || data.selectedCarName || "",

    trackName,
    trackLayout,
    carClass,
    bestLapMs,

    telemetry: {
      metadata,
      bestLap: {
        lapTime: bestLapSeconds ?? undefined,
        lapTimeMs: bestLapMs ?? undefined,
      },
    },

    createdAt: createdAtString,
    visibility: data.visibility || "public",
  };
}

export async function GET(request: NextRequest) {
  const auth = await verifyBearerAuthToken(request);

  if (isAuthError(auth)) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    let query: FirebaseFirestore.Query = adminDb
      .collection("telemetryUploads")
      .where("status", "==", "complete")
      .where("visibility", "in", ["public", "teams-only"])
      .where("userId", "==", auth.uid)
      .orderBy("createdAt", "desc");

    const docs = await query.get();

    let summaries = await Promise.all(
      docs.docs.map((doc) => getTelemetrySummary(doc))
    );

    // Still useful as a defensive check.
    summaries = summaries.filter(
      (tel) => tel.userId == auth.uid
    );

    return authSuccessResponse({telemetries: summaries})
  } catch (error) {
    console.error("Error fetching telemetries:", error);

    return authErrorResponse(
      `Failed to fetch telemetries: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
}