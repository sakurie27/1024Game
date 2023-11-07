#!/bin/env node
// @ts-check
const { readdirSync, writeFileSync, copyFileSync } = require("fs");
const { resolve, join } = require("path");

const args = process.argv.slice(process.argv.findIndex((v) => v == __filename) + 1);
const [srcDir = resolve()] = args
const targetDir = "/opt/static/videos"

const cats = readdirSync(srcDir, {
  withFileTypes: true
}).filter(path => path.isDirectory()).map(dir => dir.name);

console.log(cats);

const meta = {}
for (const cat of cats) {
  const files = readdirSync(join(srcDir, cat))
  meta[cat] = []
  for (const file of files) {
    const [_, title, bvid] = /(.*?)-(\w+).mp4/.exec(file) ?? []
    
    meta[cat].push({
      title, bvid,
    })

    copyFileSync(join(srcDir, cat, file), join(targetDir, `${bvid}.mp4`))
  }
}

console.log(meta)
writeFileSync(join(srcDir, 'meta.json'), JSON.stringify(meta))