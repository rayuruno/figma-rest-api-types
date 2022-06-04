#!/usr/bin/env node

import fetch from "../cmd/fetch.js";
import generate from "../cmd/generate.js";
import { writeFile } from "fs/promises";

const cnt = await generate(await fetch());
const dst = process.argv[2];
if (dst) {
  await writeFile(fst, cnt, "utf8");
} else {
  process.stdout.write(cnt);
}
