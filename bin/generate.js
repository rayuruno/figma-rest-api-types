#!/usr/bin/env node

import os from "os";
import { join } from "path";
import fetch from "../cmd/fetch.js";
import generate from "../cmd/generate.js";

const src = join(os.tmpdir(), "api.html");
const dst = process.argv[2];
await fetch(src);
await generate(src, dst);
