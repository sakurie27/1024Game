#!/bin/env node
// @ts-check
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const { cwd } = require("process");

require("dotenv").config({
  path: join(cwd(), ".env.local"),
});

const NGINX_VOD_ROOT = process.env["NGINX_VOD_ROOT"] ?? ".";
const metaPath = join(NGINX_VOD_ROOT, "meta.json");

const META = JSON.parse(readFileSync(metaPath).toString("utf-8"));

mkdirSync(join(NGINX_VOD_ROOT, "archive"), { recursive: true });
mkdirSync(join(NGINX_VOD_ROOT, "face"), { recursive: true });
mkdirSync(join(NGINX_VOD_ROOT, "baselabs"), { recursive: true });

/**
 * @param {any[]} meta
 */
async function downloadCover(meta) {
  // console.log(meta);
  let total = meta.length;
  let local = 0;
  let downloaded = 0;
  let errors = 0;

  for (const { title, bvid, aid, cover, upname, upavatar, desc, cat } of meta) {
    await writeFileLocal(cover, /\/bfs\/([0-9a-zA-Z./]+)/);
    await writeFileLocal(upavatar, /\/bfs\/([0-9a-zA-Z./]+)/);
  }

  async function writeFileLocal(url, regex) {
    try {
      const [_, uriPath] = url.match(regex);
      const localPath = join(NGINX_VOD_ROOT, uriPath);
      if (!existsSync(localPath)) {
        console.log("fetching", url);
        const resp = await fetch(url, {
          referrer: "https://www.bilibili.com/",
        });

        const buffer = Buffer.from(await resp.arrayBuffer());
        writeFileSync(localPath, buffer);
        downloaded += 1;
        await new Promise((res) => setTimeout(res, 200));
      } else {
        local += 1;
      }
    } catch (e) {
      errors += 1;
      console.log("Error:", url);
      console.log(e);
    }
  }
  console.log(
    "Total %d: reused %d, downloaded %d, errors %d",
    total,
    local,
    downloaded,
    errors,
  );
}

downloadCover(META).then(() => {});
