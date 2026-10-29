// Parses every source file with `node --check` (no code is executed) so syntax errors fail CI.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const files = readdirSync("src", { recursive: true })
  .filter((file) => file.endsWith(".js"))
  .map((file) => join("src", file));

const failed = files.filter(
  (file) => spawnSync(process.execPath, ["--check", file], { stdio: "inherit" }).status !== 0
);

if (failed.length) {
  console.error(`Syntax errors in ${failed.length} of ${files.length} files`);
  process.exit(1);
}
console.log(`Syntax OK (${files.length} files)`);
