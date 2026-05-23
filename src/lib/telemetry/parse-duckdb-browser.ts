import * as duckdb from "@duckdb/duckdb-wasm";

import {
    normalizeSetup,
    groupSetupByCategory,
} from "@/lib/telemetry/noramlize-setup";
import type {
    GPSDataPoint,
    LapItem,
    LapTelemetry,
    MetadataItem,
    TelemetryParseResult,
    TelemetryPoint,
} from "@/lib/telemetry/types";

type SetupQueryRow = {
    value?: string;
};

type ChannelListRow = {
    channelName: string;
    frequency: number;
    unit: string;
};

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null;

async function getDuckDb() {
    if (dbPromise) return dbPromise;

    dbPromise = (async () => {
        const bundle = {
            mainModule: "/duckdb/duckdb-eh.wasm",
            mainWorker: "/duckdb/duckdb-browser-eh.worker.js",
        };

        const worker = new Worker(bundle.mainWorker);
        const logger = new duckdb.ConsoleLogger();

        const db = new duckdb.AsyncDuckDB(logger, worker);

        await db.instantiate(bundle.mainModule);

        return db;
    })();

    return dbPromise;
}

export async function inspectDuckDbFile(file: File): Promise<TelemetryParseResult> {
    const db = await getDuckDb();
    const conn = await db.connect();

    const buffer = new Uint8Array(await file.arrayBuffer());

    await db.registerFileBuffer(file.name, buffer);
    await conn.query(`ATTACH '${file.name}' AS lmu_db`);

    const metadataResultWithoutSetup = await conn.query(`
        SELECT *
        FROM lmu_db.metadata
        WHERE key NOT LIKE '%Setup%'
        ORDER BY 1`
    );

    const bestLapsData = await conn.query(`
        SELECT *
        FROM lmu_db."Best LapTime"
        WHERE value > 0
        ORDER BY value ASC
        LIMIT 1
    `);

    const setupData = await conn.query(`
        SELECT value
        FROM lmu_db.metadata
        WHERE key = 'CarSetup'
        LIMIT 1`
    );

    const allTables = await conn.query(`
        SHOW TABLES FROM lmu_db;
    `);

    const channels = await conn.query(`
        SELECT * FROM lmu_db.channelsList;
    `);

    const inPits = await conn.query(`
        SELECT *
        FROM lmu_db."In Pits"
    `);

    console.log(allTables.toArray().map((row: any) => row.toJSON()));
    console.log(channels.toArray().map((row: any) => row.toJSON()));
    console.log(inPits.toArray().map((row: any) => row.toJSON()));

    const channelRows = rawQueryResultToArray<ChannelListRow>(channels);
    const throttleFrequency = channelRows.find((row) => row.channelName === "Throttle Pos Unfiltered")?.frequency || null;
    const brakeFrequency = channelRows.find((row) => row.channelName === "Brake Pos Unfiltered")?.frequency || null;
    const lapDistFrequency = channelRows.find((row) => row.channelName === "Lap Dist")?.frequency || null;
    const speedFrequency = channelRows.find((row) => row.channelName === "Ground Speed")?.frequency || null;
    const gpsCoordsFrequency = channelRows.find((row) => row.channelName === "GPS Latitude")?.frequency || null;
    const pathLateralFrequency = channelRows.find((row) => row.channelName === "Path Lateral")?.frequency || null;
    const trackEdgeFrequency = channelRows.find((row) => row.channelName === "Track Edge")?.frequency || null;

    const bestLapsArray = rawQueryResultToArray<LapItem>(bestLapsData);
    const bestLap = bestLapsArray[0] ?? { ts: 0, value: 0 };

    const inPitsData = rawQueryResultToArray<LapItem>(inPits);

    const telemetryStartOffset = inPitsData[0]?.ts || 0;

    const lapStartTs = bestLap.ts - bestLap.value - telemetryStartOffset;
    const lapEndTs = bestLap.ts - telemetryStartOffset;

    const throttle = await getChannelSlice({
        conn,
        channel: "Throttle Pos Unfiltered",
        frequencyHz: throttleFrequency || 50,
        lapStartTs,
        lapEndTs,
    });

    const brake = await getChannelSlice({
        conn,
        channel: "Brake Pos Unfiltered",
        frequencyHz: brakeFrequency || 50,
        lapStartTs,
        lapEndTs,
    });

    const lapDist = await getChannelSlice({
        conn,
        channel: "Lap Dist",
        frequencyHz: lapDistFrequency || 50,
        lapStartTs,
        lapEndTs,
    });

    const speed = await getChannelSlice({
        conn,
        channel: "Ground Speed",
        frequencyHz: speedFrequency || 100,
        lapStartTs,
        lapEndTs,
    });

    const gpsLat = await getChannelSlice({
        conn,
        channel: "GPS Latitude",
        frequencyHz: gpsCoordsFrequency || 10,
        lapStartTs,
        lapEndTs,
    });

    const gpsLon = await getChannelSlice({
        conn,
        channel: "GPS Longitude",
        frequencyHz: gpsCoordsFrequency || 10,
        lapStartTs,
        lapEndTs,
    });

    const pathLateral = await getChannelSlice({
        conn,
        channel: "Path Lateral",
        frequencyHz: pathLateralFrequency || 10,
        lapStartTs,
        lapEndTs,
    });

    const trackEdge = await getChannelSlice({
        conn,
        channel: "Track Edge",
        frequencyHz: trackEdgeFrequency || 10,
        lapStartTs,
        lapEndTs,
    });

    const gpsCoords: GPSDataPoint[] = [];

    for (let i = 0; i < Math.min(gpsLat.length, gpsLon.length); i++) {
        gpsCoords.push({
            lapTime: gpsLat[i].lapTime,
            value: {
                latitude: gpsLat[i].value,
                longitude: gpsLon[i].value,
                trackEdge: trackEdge[i]?.value,
                pathLateral: pathLateral[i]?.value
            }
        });
    }

    console.log("GPS Coords:", gpsCoords);

    const gears = await conn.query(`
        SELECT ts, value
        FROM lmu_db."Gear"
        WHERE ts BETWEEN ${lapStartTs} AND ${lapEndTs}
        ORDER BY ts;`
    );

    const bestLapTelemetry: LapTelemetry = {
        lapStartTs,
        lapEndTs,
        lapTime: bestLap.value,
        throttle,
        brake,
        speed,
        gpsCoords,
        lapDist,
        gears: rawQueryResultToArray<TelemetryPoint>(gears),
    };

    await conn.close();

    // Process setup data
    const rows = rawQueryResultToArray<SetupQueryRow>(setupData);
    const rawSetupJson = rows[0]?.value;
    const setup = JSON.parse(rawSetupJson ?? "{}");
    const normalizedSetup = normalizeSetup(setup);
    const groupedSetup = groupSetupByCategory(normalizedSetup);

    return {
        metadata: rawQueryResultToArray<MetadataItem>(metadataResultWithoutSetup),
        setup: groupedSetup,
        bestLapTelemetry: bestLapTelemetry,
    };
}

function rawQueryResultToArray<T extends Record<string, unknown>>(result: any): T[] {
    return result.toArray().map((row: any) => row.toJSON() as T);
}

export async function getChannelSlice({
    conn,
    dbName = "lmu_db",
    channel,
    frequencyHz,
    lapStartTs,
    lapEndTs,
}: {
    conn: any;
    dbName?: string;
    channel: string;
    frequencyHz: number;
    lapStartTs: number;
    lapEndTs: number;
}): Promise<TelemetryPoint[]> {
    const startIndex = Math.floor(lapStartTs * frequencyHz);
    const endIndex = Math.ceil(lapEndTs * frequencyHz);

    const result = await conn.query(`
    WITH indexed AS (
      SELECT
        row_number() OVER () - 1 AS idx,
        value
      FROM ${dbName}."${channel}"
    )
    SELECT
      idx,
      idx / ${frequencyHz}.0 AS sessionTime,
      value
    FROM indexed
    WHERE idx BETWEEN ${startIndex} AND ${endIndex}
    ORDER BY idx
  `);

    return result.toArray().map((row: any) => {
        const json = row.toJSON();

        return {
            lapTime: json.sessionTime - lapStartTs,
            value: json.value,
        };
    });
}