#!/bin/env node
// @ts-check
const { readdirSync, writeFileSync } = require("fs");
const { resolve, join } = require("path");

const args = process.argv.slice(process.argv.findIndex((v) => v == __filename) + 1);
const [srcDir = resolve()] = args

const cats = readdirSync(srcDir, {
  withFileTypes: true
}).filter(path => path.isDirectory()).map(dir => dir.name);

console.log(cats);

const meta = {}
for (const cat of cats) {
  const files = readdirSync(join(srcDir, cat))
  meta[cat] = []
  for (const path of files) {
    const [_, title, bvid] = /(.*?)-(\w+).mp4/.exec(path) ?? []
    
    meta[cat].push({
      title, bvid,
    })
  }
}

console.log(meta)
writeFileSync(join(srcDir, 'meta.json'), JSON.stringify(meta))