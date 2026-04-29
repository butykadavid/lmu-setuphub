import { DuckDBInstance } from "@duckdb/node-api";

const dbPath = process.argv[2];

if (!dbPath) {
  console.error("Usage: node scripts/inspect-duckdb.mjs samples/lmu-session.duckdb");
  process.exit(1);
}

const instance = await DuckDBInstance.create(dbPath);
const connection = await instance.connect();

async function query(sql) {
  const result = await connection.run(sql);
  return await result.getRows();
}

console.log("\nDuckDB file:", dbPath);

// console.log("\nTables:");
// const tables = await query("SHOW TABLES");
// console.table(tables);

// for (const row of tables) {
//   const tableName = row[0];

//   console.log(`\nSchema for table: ${tableName}`);
//   const schema = await query(`DESCRIBE "${tableName}"`);
//   console.table(schema);

//   console.log(`\nFirst 5 rows from: ${tableName}`);
//   const preview = await query(`SELECT * FROM "${tableName}" LIMIT 5`);
//   console.table(preview);
// }

// console.log("\nMetadata schema:");
// console.table(await query(`DESCRIBE metadata`));

// console.log("\nMetadata preview:");
// console.table(await query(`SELECT * FROM metadata LIMIT 50`));

// console.log("\nChannels:");
// console.table(await query(`SELECT * FROM channelsList LIMIT 20`));

// console.log("\nEvents:");
// console.table(await query(`SELECT * FROM eventsList LIMIT 50`));

// console.table(await query(`
//   SELECT key, LEFT(value, 120) AS preview
//   FROM metadata
//   ORDER BY key
// `));

const rows = await query(`
  SELECT value
  FROM metadata
  WHERE key = 'CarSetup'
`);

const carSetup = JSON.parse(rows[0][0]);

console.log(Object.keys(carSetup).slice(0, 50));

for (const [key, item] of Object.entries(carSetup).slice(0, 20)) {
  console.log(key, {
    caption: item.caption,
    stringValue: item.stringValue,
    value: item.value,
    available: item.available,
    isFreeSetting: item.isFreeSetting,
  });
}

connection.closeSync();
instance.closeSync();