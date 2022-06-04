import { test } from "uvu";
import * as assert from "uvu/assert";
import generate from "../cmd/generate.js";
import { readFile } from "fs/promises";

test("generate", async () => {
  let definitions = await generate(
    await readFile("./test/fixtures/api.html", "utf8")
  );
  console.log(definitions);
  assert.ok(definitions);
});

test.run();
