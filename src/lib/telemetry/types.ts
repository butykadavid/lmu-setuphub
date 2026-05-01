import type {
  NormalizedSetupItem,
  SetupCategory,
} from "@/lib/telemetry/noramlize-setup";

export type MetadataItem = {
  key: string;
  value: string;
};

export type BestLapItem = {
  ts: string;
  value: string;
};

export type GroupedSetup = Record<SetupCategory, NormalizedSetupItem[]>;

export type TelemetryParseResult = {
  metadata: MetadataItem[];
  bestLaps: BestLapItem[];
  setup: GroupedSetup;
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