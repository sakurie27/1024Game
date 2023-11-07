#!/bin/env node
// @ts-check
const { lstatSync, readFileSync } = require("fs");
const { ServerApiVersion } = require("mongodb");
const { MongoClient } = require("mongodb");
const { resolve } = require("path");
const { exit } = require("process");

require("dotenv").config({
  path: resolve(__dirname, ".env.db.local"),
});

const args = process.argv.slice(
  process.argv.findIndex((v) => v == __filename) + 1,
);
let [jsonFile = resolve("meta.json")] = args;

const ME_CONFIG_MONGODB_URL = "mongodb://tengfei:mvkwik@localhost:27017/";
if (!ME_CONFIG_MONGODB_URL) {
  console.error("ME_CONFIG_MONGODB_URL not defined");
  exit(1);
}
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
