module.exports = {
  apps: [
    {
      name: "agrolink-api",
      cwd: "./api",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        API_PORT: 4000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
    {
      name: "agrolink-frontend",
      script: "node",
      args: "./.output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // VITE_API_URL is baked into the build at build-time, not runtime
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
