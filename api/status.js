const { runtimeStatus } = require("../lib/launchops");

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(runtimeStatus());
};
