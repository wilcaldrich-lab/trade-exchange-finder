import { execSync } from "node:child_process";

const dirty = execSync("git status --porcelain", { encoding: "utf8" });
if (dirty.trim()) {
  console.error("predeploy: working tree is not clean");
  console.error(dirty);
  process.exit(1);
}

const head = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
const main = execSync("git rev-parse origin/main", { encoding: "utf8" }).trim();
if (head !== main) {
  console.error(`predeploy: HEAD ${head} is not origin/main ${main}`);
  process.exit(1);
}
