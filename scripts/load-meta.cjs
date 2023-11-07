#!/bin/env node
// @ts-check
const { readdirSync, writeFileSync, copyFileSync } = require("fs");
const { resolve, join } = require("path");

/**
 * @param {string} bvid
 */
async function fetchMeta(bvid) {
  if (typeof bvid !== "string") {
    throw Error("wrong bvid");
  }
  const resp = await fetch(
    `https://api.szfx.top/bilibili/api.php?bv=BV${bvid}`,
  );
  try {
    const result = await resp.json();
    return result;
  } catch (e) {
    console.log(resp);
    console.error(e);
  }
  return { code: -1 };
}

const args = process.argv.slice(
  process.argv.findIndex((v) => v == __filename) + 1,
);
const [srcDir = resolve()] = args;
const metaPath = "/opt/static/meta.json";

const cats = readdirSync(srcDir, {
  withFileTypes: true,
})
  .filter((path) => path.isDirectory())
  .map((dir) => dir.name);

console.log(cats);

const META = [];
const tasks = [];
for (const cat of cats) {
  const files = readdirSync(join(srcDir, cat));
  for (const file of files) {
    const [_, title, bvid] = /(.*?)-(\w+).mp4/.exec(file) ?? [];

    tasks.push(
      new Promise(async (res) => {
        const meta = await fetchMeta(bvid);
        if (meta.code == "200") {
          delete meta.code;
        } else {
          throw Error(
            `Error fetching: [${cat}] (${bvid}): \n\t${JSON.stringify(meta)}`,
          );
        }

        META.push({
          ...meta,
          cat,
          bvid,
        });
        res(void 0);
      }),
    );
  }
}

Promise.all(tasks).then(() => {
  console.log(META);
  writeFileSync(metaPath, JSON.stringify(META));
});
