#!/bin/env node
// @ts-check
const {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} = require("fs");
const { join } = require("path");
const { cwd } = require("process");

const hmacsha1 = require('hmacsha1') // (k: string, i: string) => string 

require("dotenv").config({
  path: join(cwd(), ".env.local"),
});

const USER = process.env["MONGO_USERNAME"];
const PASSWD = process.env["MONGO_PASSWORD"];
const HOST = process.env["MONGO_HOST"];
const PORT = process.env["MONGO_PORT"];
const QINIU_AK = process.env["QINIU_AK"];
const QINIU_SK = process.env["QINIU_SK"];
const NGINX_VOD_ROOT = process.env["NGINX_VOD_ROOT"] ?? ".";

const videoPaths = readdirSync(join(NGINX_VOD_ROOT, "videos"));
const bucketName = "video";
const region = "z1";
const method = "POST";
// Host, MIME, X-Qiniu...
const extraHeaders = { "X-Qiniu-Date": new Date().toISOString() };
const body = undefined // ?? json/xml/raw
const url = new URL(
  `https://uc.qiniuapi.com/mkbucketv3/${bucketName}/region/${region}`,
);

const signInput = `${method} ${url.pathname}\nHost: ${
  url.host
}\n${Object.entries(extraHeaders)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}\n\n`;

// @ts-ignore
const sign = Buffer.from(hmacsha1(QINIU_SK, signInput), 'utf-8' /* ?? */).toString('base64url')

fetch(url, {
  method,
  headers: {
    ...extraHeaders,
    Authorization: `Qiniu ${QINIU_AK}:${sign}`,
  },
}).then( resp => {
  if (resp.ok) {
  }
})
// aws-s3-compat