// Full-page screenshot via the local Chrome install (no dependencies).
// Usage: node screenshot.mjs http://localhost:3000 [label] [width]
// Saves to ./temporary screenshots/screenshot-N[-label].png
import { spawn } from "node:child_process";
import { mkdir, readdir, writeFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const [url = "http://localhost:3000", label, widthArg] = process.argv.slice(2);
const width = Number(widthArg) || 1440;
const height = width < 768 ? 844 : 900;
const chromePath =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const outDir = join(fileURLToPath(new URL(".", import.meta.url)), "temporary screenshots");
await mkdir(outDir, { recursive: true });
const n =
  Math.max(0, ...(await readdir(outDir)).map((f) => Number(f.match(/^screenshot-(\d+)/)?.[1] || 0))) + 1;
const outFile = join(outDir, `screenshot-${n}${label ? `-${label}` : ""}.png`);

const profile = await mkdtemp(join(tmpdir(), "shot-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  "--remote-debugging-port=0",
  `--user-data-dir=${profile}`,
  "--hide-scrollbars",
  "about:blank",
]);

const wsUrl = await new Promise((resolve, reject) => {
  chrome.stderr.on("data", (d) => {
    const m = String(d).match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) resolve(m[1]);
  });
  chrome.on("exit", () => reject(new Error("Chrome exited early")));
});

const browser = new WebSocket(wsUrl);
await new Promise((r) => browser.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
browser.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
const send = (method, params = {}, sessionId) =>
  new Promise((resolve) => {
    const msgId = ++id;
    pending.set(msgId, resolve);
    browser.send(JSON.stringify({ id: msgId, method, params, sessionId }));
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { result: target } = await send("Target.createTarget", { url: "about:blank" });
const { result: attached } = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
const s = attached.sessionId;
const page = (method, params) => send(method, params, s);

await page("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
await page("Page.enable");
await page("Page.navigate", { url });
await sleep(1500);

// Scroll through so scroll-triggered reveals fire, then return to top.
const evaluate = async (expression) =>
  (await page("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
await evaluate(`(async () => {
  await document.fonts.ready;
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
    scrollTo(0, y); await new Promise(r => setTimeout(r, 120));
  }
  scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
})()`);
const fullHeight = await evaluate("document.documentElement.scrollHeight");

const { result: shot } = await page("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width, height: fullHeight, scale: 1 },
});
await writeFile(outFile, Buffer.from(shot.data, "base64"));
console.log(outFile);

browser.close();
chrome.kill();
