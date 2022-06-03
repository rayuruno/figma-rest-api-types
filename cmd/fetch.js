import puppeteer from "puppeteer";
import { writeFile } from "fs/promises";

export default async (src) => {
  if (!src) {
    throw new Error("output filename missing");
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.figma.com/developers/api");
  await writeFile(src, await page.content());
  await browser.close();
};
