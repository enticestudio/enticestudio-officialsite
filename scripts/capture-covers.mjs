// Captures the starting screen ("tap to open" cover) of every demo invitation
// and saves it as public/demos/<slug>/cover.jpg. Those images are shown inside
// the phone cards on the category pages and the Demos page.
//
// Usage (uses your installed Chrome — nothing is downloaded):
//   npm run build && npm start          # production server on :3000 (no dev badge)
//   npm run covers                      # in a second terminal
// Options:  BASE_URL=http://localhost:3100 npm run covers
//           npm run covers -- kandyan-gold noir-gold   (only these slugs)

import { mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const ROOT = path.resolve(import.meta.dirname, "..");

// Find a local Chrome or Edge
const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) throw new Error("Chrome/Edge not found — set CHROME_PATH to your browser's executable.");

// Read slugs + sample guests straight from the data file
const src = (
  await Promise.all(["src/lib/invitations.ts", "src/lib/moments.ts"].map((f) => readFile(path.join(ROOT, f), "utf8")))
).join("\n");
const all = [...src.matchAll(/slug: "([^"]+)"[\s\S]*?sampleGuest: "([^"]+)"/g)].map((m) => ({ slug: m[1], guest: m[2] }));
const only = process.argv.slice(2);
const demos = only.length ? all.filter((d) => only.includes(d.slug)) : all;

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--mute-audio", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

for (const { slug, guest } of demos) {
  const url = `${BASE_URL}/i/${slug}?guest=${encodeURIComponent(guest)}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector("[data-gate]");
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 2600)); // let line-draws and the greeting fade-in finish
  const png = await page.screenshot({ type: "png" });

  const dir = path.join(ROOT, "public/demos", slug);
  await mkdir(dir, { recursive: true });
  await sharp(png).resize(600).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(dir, "cover.jpg"));
  console.log(`✓ ${slug}`);
}

await browser.close();
