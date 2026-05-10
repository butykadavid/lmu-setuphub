import { TelemetryPoint } from "@/lib/telemetry/types";

export default function TelemetryPointRangeVisualizer({
    points,
    color }: {
        points: TelemetryPoint[];
        color: string;
    }) {
    if (!points.length) {
        return (
            <div className="flex h-32 w-full items-center justify-center rounded-xs bg-muted text-sm text-muted-foreground">
                No telemetry data
            </div>
        );
    }

    console.log(points)

    const width = 1000;
    const height = 128;

    const maxLapTime = Math.max(...points.map((p) => p.lapTime));
    const maxValue = Math.max(...points.map((p) => p.value), 100);

    const path = points
        .map((point, index) => {
            const x = (point.lapTime / maxLapTime) * width;
            const y = height - (point.value / maxValue) * height;

            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

    const areaPath = `
    ${path}
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

    return (
        <div className="relative h-24 w-full overflow-auto rounded-sm border border-border bg-muted">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="h-full w-full"
            >
                <path d={areaPath} fill={color} opacity="0.18" />
                <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            <div className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
                {maxLapTime.toFixed(1)}s
            </div>
        </div>
    );
}