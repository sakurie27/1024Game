#!/bin/env node
// @ts-check
/** (step 2)
 *  export-to-db [metaFilePath]
 *
 *  - metaFilePath: the folder or the path to meta.json
 */
const { lstatSync, readFileSync } = require("fs");
const { ServerApiVersion } = require("mongodb");
const { MongoClient } = require("mongodb");
const { resolve, join } = require("path");
const { cwd } = require("process");

require("dotenv").config({
  path: join(cwd(), ".env.local"),
});

const USER = process.env["MONGO_INITDB_ROOT_USERNAME"];
const PASSWD = process.env["MONGO_INITDB_ROOT_PASSWORD"];
const HOST = process.env["MONGO_HOST"];
const PORT = process.env["MONGO_PORT"];

const args = process.argv.slice(
  process.argv.findIndex((v) => v == __filename) + 1,
);
let [jsonFile = join(cwd(), "meta.json")] = args;

const ME_CONFIG_MONGODB_URL = `mongodb://${USER}:${PASSWD}@${HOST}:${PORT}/`;
const mongo = new MongoClient(ME_CONFIG_MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

if (lstatSync(jsonFile).isDirectory()) {
  jsonFile = resolve(jsonFile, "meta.json");
}

const json = readFileSync(jsonFile).toString("utf-8");
const records = JSON.parse(json);

/**
 * @param {{bvid: string}[]} records
 */
async function saveRecords(records) {
  try {
    console.log("loading %d records", records.length);
    await mongo.connect();
    const db = mongo.db("data");
    const meta = await db.createCollection("meta");

    const result = await meta.bulkWrite(
      records.map((doc) => ({
        updateOne: {
          filter: { bvid: doc.bvid },
          update: { $set: doc },
          upsert: true,
        },
      })),
    );

    console.log(result);
  } finally {
    await mongo.close();
  }
}

saveRecords(records).catch((e) => {
  console.dir(e);
});
