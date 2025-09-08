const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "app.log");

function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms\n`;
    fs.appendFileSync(logFile, log);
  });

  next();
}

module.exports = logger;

