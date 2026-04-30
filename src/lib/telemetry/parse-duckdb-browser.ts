// src/lib/telemetry/parse-duckdb-browser.ts
import * as duckdb from "@duckdb/duckdb-wasm";

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

export async function inspectDuckDbFile(file: File) {
    const db = await getDuckDb();
    const conn = await db.connect();

    const buffer = new Uint8Array(await file.arrayBuffer());

    await db.registerFileBuffer(file.name, buffer);
    await conn.query(`ATTACH '${file.name}' AS lmu_db`);

    const metadataResultWithoutSetup = await conn.query(`
    SELECT *
    FROM lmu_db.metadata
    WHERE key NOT LIKE '%Setup%'
    ORDER BY 1
  `);

    await conn.close();

    return {
        metadata: metadataResultWithoutSetup.toArray().map((row) => row.toJSON()),
    };
}