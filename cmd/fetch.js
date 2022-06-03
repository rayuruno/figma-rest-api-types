import os from "os";
import { join } from "path";
import puppeteer from "puppeteer";
import { writeFile } from "fs/promises";

const htmlPath = join(os.tmpdir(), "api.html");
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("https://www.figma.com/developers/api");
await writeFile(htmlPath, await page.content());
await browser.close();
