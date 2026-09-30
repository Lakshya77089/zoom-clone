const isWindows = process.platform === "win32";
const separator = isWindows ? "\\" : "/";
const root = __dirname.slice(0, __dirname.lastIndexOf(separator));

const BACKEND_PORT = Number(process.env.E2E_BACKEND_PORT ?? 8100);
const FRONTEND_PORT = Number(process.env.E2E_FRONTEND_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${FRONTEND_PORT}`;
const EXTERNAL = Boolean(process.env.E2E_BASE_URL);

const python = process.env.E2E_PYTHON ?? (isWindows ? ".venv\\Scripts\\python.exe" : ".venv/bin/python");

const servers = [
  {
    name: "backend",
    command: `"${python}" -m uvicorn app.main:app --port ${BACKEND_PORT}`,
    cwd: `${root}${separator}..${separator}backend`,
    url: `http://127.0.0.1:${BACKEND_PORT}/api/users/me`,
    env: {
      DATABASE_URL: process.env.E2E_DATABASE_URL ?? "sqlite:///./e2e.db",
      TURN_URLS: "",
      TURN_USERNAME: "",
      TURN_CREDENTIAL: "",
      CLOUDFLARE_TURN_KEY_ID: "",
      CLOUDFLARE_TURN_API_TOKEN: "",
      METERED_KEY_ID: "",
      METERED_SIGNING_SECRET: "",
    },
  },
  {
    name: "frontend",
    command: `npx next build && npx next start --port ${FRONTEND_PORT}`,
    cwd: root,
    url: BASE_URL,
    env: { BACKEND_URL: `http://127.0.0.1:${BACKEND_PORT}`, NEXT_DIST_DIR: ".next-e2e" },
  },
];

module.exports = { BASE_URL, EXTERNAL, root, servers };
