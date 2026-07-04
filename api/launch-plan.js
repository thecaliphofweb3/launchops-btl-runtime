const { createLaunchPlan } = require("../lib/launchops");

async function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    const input = await parseBody(req);
    const result = await createLaunchPlan(input);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
