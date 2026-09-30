import { spawn, spawnSync } from "node:child_process";
import testServers from "./test-servers.cjs";

const { BASE_URL, EXTERNAL, root, servers } = testServers;
const STARTUP_TIMEOUT_MS = 300_000;
const POLL_MS = 1000;

async function isUp(url) {
  try {
    const response = await fetch(url);
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitFor(url) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await isUp(url)) return;
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function run(command, cwd, env) {
  const merged = { ...process.env, ...env };
  delete merged.ELECTRON_RUN_AS_NODE;
  return spawn(command, { cwd, shell: true, stdio: "inherit", env: merged });
}

function stop(child) {
  if (child.exitCode !== null) return;
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
  else child.kill("SIGTERM");
}

const command = process.argv.slice(2).join(" ");
if (!command) {
  console.error("Usage: node scripts/with-test-servers.mjs <command>");
  process.exit(1);
}

const started = [];
const shutdown = () => started.forEach(stop);
process.on("SIGINT", () => {
  shutdown();
  process.exit(130);
});

try {
  for (const server of EXTERNAL ? [] : servers) {
    if (await isUp(server.url)) continue;
    started.push(run(server.command, server.cwd, server.env));
    await waitFor(server.url);
  }
} catch (error) {
  console.error(error);
  shutdown();
  process.exit(1);
}

const child = run(command, root, { CYPRESS_BASE_URL: BASE_URL });
child.on("exit", (code) => {
  shutdown();
  process.exit(code ?? 1);
});
