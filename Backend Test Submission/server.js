
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const logger = require("../logging-middleware");

const app = express();
app.use(bodyParser.json());
app.use(logger);

const PORT = 5000;

let urls = {}; 
app.post("/shorturls", (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const code = shortcode || uuidv4().slice(0, 6);
  const expiry = new Date(Date.now() + validity * 60 * 1000);

  urls[code] = {
    url,
    expiry,
    createdAt: new Date(),
    clicks: []
  };

  return res.status(201).json({
    shortLink: `http://localhost:${PORT}/${code}`,
    expiry: expiry.toISOString(),
  });
});
app.get("/shorturls/:code", (req, res) => {
  const { code } = req.params;
  const record = urls[code];

  if (!record) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.json({
    originalUrl: record.url,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: record.clicks.length,
    clicks: record.clicks
  });
});
app.get("/:code", (req, res) => {
  const { code } = req.params;
  const record = urls[code];

  if (!record || new Date() > record.expiry) {
    return res.status(410).json({ error: "Link expired or not found" });
  }

  record.clicks.push({
    timestamp: new Date(),
    referrer: req.get("Referrer") || "Direct",
    ip: req.ip
  });

  res.redirect(record.url);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
