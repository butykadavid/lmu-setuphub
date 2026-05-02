import type {
  NormalizedSetupItem,
  SetupCategory,
} from "@/lib/telemetry/noramlize-setup";

export type MetadataItem = {
  key: string;
  value: string;
};

export type BestLapItem = {
  ts: number;
  value: number;
};

export type GroupedSetup = Record<SetupCategory, NormalizedSetupItem[]>;

export type TelemetryParseResult = {
  metadata: MetadataItem[];
  bestLap: BestLapItem;
  setup: GroupedSetup;
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