const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const appDir = path.join(root, "app");
const publicDir = path.join(root, "public");

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

for (const file of ["index.html", "styles.css", "app.js"]) {
  fs.copyFileSync(path.join(appDir, file), path.join(publicDir, file));
}

console.log("LaunchOps static frontend copied to public/");
