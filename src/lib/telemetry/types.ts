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