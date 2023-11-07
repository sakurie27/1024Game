#!/bin/env node
// @ts-check
/** (step 1)
 * import-bilibili [mediaPath]
 *  - mediaPath: e.g. /mnt/d/videos
 *   contains serveral folders named by category
 */
const { readdirSync, writeFileSync, copyFileSync } = require("fs");
const { join } = require("path");
const { cwd } = require("process");

require("dotenv").config({
  path: join(cwd(), ".env.local"),
});
const args = process.argv.slice(
  process.argv.findIndex((v) => v == __filename) + 1,
);
const [srcMediaDir = cwd()] = args;
const NGINX_VOD_ROOT = process.env["NGINX_VOD_ROOT"];

const targetDir = `${NGINX_VOD_ROOT}/videos/`;
const metaPath = `${NGINX_VOD_ROOT}/meta.json"`;

const cats = readdirSync(srcMediaDir, {
  withFileTypes: true,
})
  .filter((path) => path.isDirectory())
  .map((dir) => dir.name);

console.log(cats);

const META = [];
const tasks = [];
for (const cat of cats) {
  const files = readdirSync(join(srcMediaDir, cat));
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

    copyFileSync(join(srcMediaDir, cat, file), join(targetDir, `${bvid}.mp4`));
  }
}

Promise.all(tasks).then(() => {
  console.log(META);
  writeFileSync(metaPath, JSON.stringify(META));
});
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
