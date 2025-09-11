const next = require("next");
const express = require("express");
const path = require("path");

// In-memory registry utilities
const registry = require("./lib/registry");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const basePath = process.argv[2] || process.env.NANOCL_REGISTRY_PATH || "/folder";
const latestVersionArg = process.argv[3] || process.env.NANOCL_LATEST_VERSION || "v0.17";

const app = next({ dev });
const handle = app.getRequestHandler();

registry.initRegistry(basePath, latestVersionArg);

app.prepare().then(() => {
  const server = express();
  // Helper to detect nanocl clients
  function isNanoclClient(req) {
    const ua = String(req.headers["user-agent"] || "").toLowerCase();
    return ua.includes("nanocl");
  }
  server.use("/public", express.static(path.join(__dirname, './public')))
  // Home redirects to latest version page
  server.get("/", (req, res) => {
    const version = registry.getLatestVersion();
    const data = JSON.stringify(registry.getVersion(version));
    return app.render(req, res, `/${version}`, { data });
  });
  // Version main page: /v0.16
  server.get("/:version", (req, res) => {
    const { version } = req.params;
    const data = JSON.stringify(registry.getVersion(version));
    return app.render(req, res, `/${version}`, { data });
  });
  // Tag page: /tag/security -> uses latest version by default
  server.get("/tag/:tag", (req, res) => {
    const { tag } = req.params;
    const version = registry.getLatestVersion();
    const data = JSON.stringify(registry.getByTag(version, tag));
    return app.render(req, res, `/tag/${tag}`, { version, data });
  });
  server.get("/:version/:statefile/:statefile_version", (req, res) => {
    const { version, statefile, statefile_version } = req.params;
    const hooked_version = statefile_version.replace(/\.yaml$/, "").replace(/\.yml$/, "");
    const entry = registry.getStatefileVersion(version, statefile, hooked_version);
    if (isNanoclClient(req)) {
      res.setHeader("Content-Type", "text/yaml; charset=utf-8");
      return res.send(entry.yamlText);
    }
    return app.render(req, res, `/${version}/${statefile}`, {
      entry: JSON.stringify(entry),
    });
  });
  // Statefile page or raw YAML depending on User-Agent
  // /v0.16/certbot
  server.get("/:version/:statefile", (req, res) => {
    const { version, statefile } = req.params;
    const hooked_statefile = statefile.replace(/\.yaml$/, "").replace(/\.yml$/, "");
    const entry = registry.getStatefile(version, hooked_statefile);
    if (isNanoclClient(req)) {
      res.setHeader("Content-Type", "text/yaml; charset=utf-8");
      return res.send(entry.yamlText);
    }
    return app.render(req, res, `/${version}/${statefile}`, {
      entry: JSON.stringify(entry),
    });
  });
  // Fallback to Next handler
  server.all("/{*any}", (req, res) => handle(req, res));
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Nanocl Registry ready on http://localhost:${port}`);
  });
});
