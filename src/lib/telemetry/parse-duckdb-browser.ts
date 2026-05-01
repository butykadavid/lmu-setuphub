import * as duckdb from "@duckdb/duckdb-wasm";

import {
    normalizeSetup,
    groupSetupByCategory,
} from "@/lib/telemetry/noramlize-setup";
import type {
    BestLapItem,
    MetadataItem,
    TelemetryParseResult,
} from "@/lib/telemetry/types";

type SetupQueryRow = {
    value?: string;
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
        ORDER BY value ASC`
    );

    const setupData = await conn.query(`
        SELECT value
        FROM lmu_db.metadata
        WHERE key = 'CarSetup'
        LIMIT 1`
    );

    // const tables = await conn.query(`
    //     SHOW TABLES FROM lmu_db`
    // );

    // console.log(tables.toArray().map((row) => row.toJSON()));

    await conn.close();

    // Process setup data
    const rows = rawQueryResultToArray<SetupQueryRow>(setupData);
    const rawSetupJson = rows[0]?.value;
    const setup = JSON.parse(rawSetupJson ?? "{}");
    const normalizedSetup = normalizeSetup(setup);
    const groupedSetup = groupSetupByCategory(normalizedSetup);

    return {
        metadata: rawQueryResultToArray<MetadataItem>(metadataResultWithoutSetup),
        bestLaps: rawQueryResultToArray<BestLapItem>(bestLapsData),
        setup: groupedSetup,
    };
}

function rawQueryResultToArray<T extends Record<string, unknown>>(result: any): T[] {
    return result.toArray().map((row: any) => row.toJSON() as T);
}