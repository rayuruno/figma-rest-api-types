import puppeteer from "puppeteer";
import { writeFile } from "fs/promises";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("https://www.figma.com/developers/api");
await writeFile("./tmp/api.html", await page.content());
await browser.close();
