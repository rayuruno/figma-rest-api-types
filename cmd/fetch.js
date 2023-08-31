import puppeteer from "puppeteer";

export default async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.figma.com/developers/api");
  await page.waitForTimeout(5000)
  const content = await page.content();
  await browser.close();
  return content;
};
