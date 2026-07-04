const http = require("http");
const fs = require("fs");
const path = require("path");
const { createLaunchPlan, demoPlan, runtimeStatus } = require("./lib/launchops");

const PORT = Number(process.env.PORT || 4173);
const publicDir = path.join(__dirname, "app");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(publicDir, pathname));

  if (!filePath.startsWith(publicDir)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }
    send(res, 200, data, mime[path.extname(filePath)] || "application/octet-stream");
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/status") {
    send(res, 200, JSON.stringify(runtimeStatus()));
    return;
  }

  if (req.method === "POST" && req.url === "/api/launch-plan") {
    let input = {};
    try {
      input = await readBody(req);
      const result = await createLaunchPlan(input);
      send(res, 200, JSON.stringify(result));
    } catch (error) {
      send(res, 500, JSON.stringify({
        error: error.message,
        fallback: demoPlan(input).content
      }));
    }
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  send(res, 405, "Method not allowed", "text/plain; charset=utf-8");
});

function startServer(port = PORT) {
  return server.listen(port, () => {
    const address = server.address();
    const actualPort = typeof address === "object" && address ? address.port : port;
    const status = runtimeStatus();
    console.log(`LaunchOps is running at http://localhost:${actualPort}`);
    console.log(`BTL runtime endpoint: ${status.endpoint}`);
    console.log(`Live runtime enabled: ${status.liveRuntimeEnabled}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { server, startServer };
