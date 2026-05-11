import { GPSDataPoint } from "@/lib/telemetry/types";

export default function TrackMapTelemetryComponent({ gpsCoordInputs }: { gpsCoordInputs: GPSDataPoint[] }) {
    const gpsCoords = gpsCoordInputs.map(gci => gci.value)

    const width = 800;
    const height = 500;
    const padding = 24;

    if (!gpsCoords.length) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
                No GPS data available
            </div>
        );
    }

    const longitudes = gpsCoords.map((p) => p.longitude);
    const latitudes = gpsCoords.map((p) => p.latitude);

    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);

    const lonRange = maxLon - minLon || 1;
    const latRange = maxLat - minLat || 1;

    const scale = Math.min(
        (width - padding * 2) / lonRange,
        (height - padding * 2) / latRange
    );

    const points = gpsCoords.map((point) => {
        const x = (point.longitude - minLon) * scale + padding;

        const y =
            height -
            ((point.latitude - minLat) * scale + padding);

        return { x, y };
    });

    const pathData = points
        .map((point, index) => {
            return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
        })
        .join(" ");

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card p-4">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-[500px] w-full"
            >
                <path
                    d={pathData}
                    fill="none"
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}