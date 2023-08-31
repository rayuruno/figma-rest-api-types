#!/usr/bin/env node

import fetch from "../cmd/fetch.js";
import generate from "../cmd/generate.js";
import { writeFile } from "fs/promises";

console.log('Waiting for Figma REST API documentation page and assets...')
const page = await fetch()
console.log('Generating types...')
const cnt = await generate(page);
const dst = process.argv[2];
if (dst) {
  console.log(`Writing ${dst} file...`)
  await writeFile(dst, cnt, "utf8");
} else {
  process.stdout.write(cnt);
}
