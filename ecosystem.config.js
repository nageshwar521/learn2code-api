module.exports = {
  apps: [
    {
      name: "SalonPOS-Api",
      namespace: "api.alnlabs.com",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: true,
      error_file: "err.log",
      out_file: "out.log",
      log_file: "combined.log",
      time: true,
      env: {},
    },
  ],
};
