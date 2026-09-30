const backendPort = process.env.ZOOM_BACKEND_PORT || "8750";
const frontendPort = process.env.ZOOM_FRONTEND_PORT || "3700";

module.exports = {
  apps: [
    {
      name: "zoom-backend",
      cwd: `${__dirname}/backend`,
      script: ".venv/bin/uvicorn",
      args: `app.main:app --host 127.0.0.1 --port ${backendPort} --proxy-headers`,
      interpreter: "none",
      max_memory_restart: "300M",
      time: true,
    },
    {
      name: "zoom-frontend",
      cwd: `${__dirname}/frontend`,
      script: "server.js",
      env: { NODE_ENV: "production", PORT: frontendPort, HOSTNAME: "127.0.0.1" },
      max_memory_restart: "300M",
      time: true,
    },
  ],
};
