// Paints the hero envelope's artwork once and saves it as images, so visitors'
// devices don't have to paint it (that took seconds on phones).
//
// Usage (with the dev server running):   npm run bake:envelope
// Options:  BASE_URL=http://localhost:3100 npm run bake:envelope
//
// Paints with src/components/three/stationery-paint.ts inside a real page of the
// site (so the site's fonts are available) and writes public/hero/envelope/*.webp.

import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = path.join(ROOT, "public/hero/envelope");

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) throw new Error("Chrome/Edge not found — set CHROME_PATH to your browser's executable.");

// TypeScript → plain JavaScript the browser can run
const source = await readFile(path.join(ROOT, "src/components/three/stationery-paint.ts"), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;

const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
await page.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle0" }); // any page: it carries the site's fonts
await page.addScriptTag({ type: "module", content: `${js}\nwindow.__paintCanvases = paintCanvases;` });
await page.waitForFunction(() => typeof window.__paintCanvases === "function");

const images = await page.evaluate(async () => {
  const canvases = await window.__paintCanvases();
  return Object.fromEntries(Object.entries(canvases).map(([name, c]) => [name, c.toDataURL("image/png")]));
});
await browser.close();

await mkdir(OUT, { recursive: true });
for (const [name, dataUrl] of Object.entries(images)) {
  const file = path.join(OUT, `${name}.webp`);
  const png = Buffer.from(dataUrl.split(",")[1], "base64");
  const info = await sharp(png).webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(file);
  console.log(`✓ ${name}.webp  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
