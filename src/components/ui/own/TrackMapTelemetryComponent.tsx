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
    const trackEdge = gpsCoords.map((p) => p.trackEdge);
    const pathLateral = gpsCoords.map((p) => p.pathLateral);

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

    // Conversion factors: meters to degrees
    // At equator: 1 degree latitude ≈ 110540 meters, 1 degree longitude ≈ 111320 meters
    // Adjust longitude for the average latitude of the track
    const avgLat = (minLat + maxLat) / 2;
    const metersPerDegreeLat = 110540;
    const metersPerDegreeLon = 111320 * Math.cos((avgLat * Math.PI) / 180);
    
    const degreesPerMeterLat = 1 / metersPerDegreeLat;
    const degreesPerMeterLon = 1 / metersPerDegreeLon;

    const points = gpsCoords.map((point) => {
        const x = (point.longitude - minLon) * scale + padding;

        const y =
            height -
            ((point.latitude - minLat) * scale + padding);

        return { x, y };
    });

    const centerPoints = points.map((point, index) => {
        const prevPoint = points[index - 1] || point;
        const nextPoint = points[index + 1] || point;

        const dx = nextPoint.x - prevPoint.x;
        const dy = nextPoint.y - prevPoint.y;
        const length = Math.sqrt(dx * dx + dy * dy) || 1;

        const perpX = -dy / length;
        const perpY = dx / length;

        const lateralMeters = -(pathLateral[index] || 0); 
        const lateralDegreesLat = lateralMeters * degreesPerMeterLat;
        const lateralDegreesLon = lateralMeters * degreesPerMeterLon;
        
        const offsetX = lateralDegreesLon * scale;
        const offsetY = -lateralDegreesLat * scale;

        return {
            x: point.x + perpX * offsetX + perpY * offsetY,
            y: point.y + perpY * offsetX - perpX * offsetY,
        };
    });

    const edgePoints = points.map((point, index) => {
        const prevPoint = points[index - 1] || point;
        const nextPoint = points[index + 1] || point;

        const dx = nextPoint.x - prevPoint.x;
        const dy = nextPoint.y - prevPoint.y;
        const length = Math.sqrt(dx * dx + dy * dy) || 1;

        const perpX = -dy / length;
        const perpY = dx / length;

        const lat = pathLateral[index];
        const edge = trackEdge[index] || 0;
        
        let leftDistanceMeters: number;
        let rightDistanceMeters: number;

        if (lat && lat >= 0) {
            rightDistanceMeters = edge;
            leftDistanceMeters = -(lat + edge);
        } else {
            leftDistanceMeters = -edge;
            rightDistanceMeters = Math.abs(lat || 0) + edge;
        }

        const leftDegreesLat = leftDistanceMeters * degreesPerMeterLat;
        const leftDegreesLon = leftDistanceMeters * degreesPerMeterLon;
        const rightDegreesLat = rightDistanceMeters * degreesPerMeterLat;
        const rightDegreesLon = rightDistanceMeters * degreesPerMeterLon;

        const leftOffsetX = leftDegreesLon * scale;
        const leftOffsetY = -leftDegreesLat * scale;
        const rightOffsetX = rightDegreesLon * scale;
        const rightOffsetY = -rightDegreesLat * scale;

        return {
            left: {
                x: point.x + perpX * leftOffsetX + perpY * leftOffsetY,
                y: point.y + perpY * leftOffsetX - perpX * leftOffsetY,
            },
            right: {
                x: point.x + perpX * rightOffsetX + perpY * rightOffsetY,
                y: point.y + perpY * rightOffsetX - perpX * rightOffsetY,
            },
        };
    });

    const pathData = points
        .map((point, index) => {
            return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
        })
        .join(" ");

    const centerPathData = centerPoints
        .map((point, index) => {
            return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
        })
        .join(" ");

    const leftEdgeData = edgePoints
        .map((edge, index) => {
            return `${index === 0 ? "M" : "L"} ${edge.left.x} ${edge.left.y}`;
        })
        .join(" ");

    const rightEdgeData = edgePoints
        .map((edge, index) => {
            return `${index === 0 ? "M" : "L"} ${edge.right.x} ${edge.right.y}`;
        })
        .join(" ");

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card p-4">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-[500px] w-full"
            >
                {/* Track center line */}
                <path
                    d={centerPathData}
                    fill="none"
                    stroke="rgba(100, 150, 200, 0.6)"
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Track edges */}
                {/* <path
                    d={leftEdgeData}
                    fill="none"
                    stroke="rgba(200, 100, 100, 1)"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d={rightEdgeData}
                    fill="none"
                    stroke="rgba(200, 100, 100, 1)"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />  */}

                {/* Car path */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="white"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}