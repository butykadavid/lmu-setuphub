import type {
  NormalizedSetupItem,
  SetupCategory,
} from "@/lib/telemetry/noramlize-setup";

export type MetadataItem = {
  key: string;
  value: string;
};

export type LapItem = {
  ts: number;
  value: number;
};

export type GroupedSetup = Record<SetupCategory, NormalizedSetupItem[]>;

export type TelemetryParseResult = {
  metadata: MetadataItem[];
  setup: GroupedSetup;
  bestLapTelemetry: LapTelemetry;
};

export type TelemetryUploadPayload = TelemetryParseResult & {
  selectedCarId: string;
  selectedCarName: string;
  driverNote: string;
  carConfirmed: boolean;
  dataConfirmed: boolean;
  visibility: "public" | "private" | "teams-only";
};

export type TelemetryUploadResponse = {
  message: string;
  telemetryId: string;
};

export type LmuTelemetrySummary = {
  carClass: string | null;
  carName: string | null;
  trackName: string | null;
  trackLayout: string | null;
  sessionType: string | null;
  weatherConditions: string | null;
  recordingTime: string | null;
  driverName: string | null;
  steamId: string | null;
  setup: Record<string, unknown> | null;
};

export type TelemetryPoint = {
  lapTime: number;
  value: number;
}

export type LapTelemetry = {
  lapStartTs: number;
  lapEndTs: number;
  lapTime: number;
  throttle: TelemetryPoint[];
  brake: TelemetryPoint[];
  speed: TelemetryPoint[];
  gpsCoords: GPSDataPoint[];
  lapDist: TelemetryPoint[];
  gears: TelemetryPoint[];
};

export type GPSDataPoint = {
  lapTime: number;
  value: { longitude: number, latitude: number };
}

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