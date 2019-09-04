// Edits the repo to make a source consistent with how apm install will work.
// The package.json changes are reverted in postversion, which is before
// apx starts making the bundle.

const {spawnSync, shrinkwrap} = require("./utils");

function lint(fix = true) {
  console.log("Fixing lint issues...");
  spawnSync("npm", ["run", fix ? "fix-lint" : "lint"]);
}

function uploadGit() {
  console.log("Committing all changes...");
  spawnSync("git", ["add", "."]);
  spawnSync("git", ["commit", "-m", "prepare for publish"]);
  spawnSync("git", ["push"]);
}

function recompileSource() {
  console.log("Recompiling source...");
  spawnSync("rm", ["-rf", "./dist"]);
  spawnSync("tsc", [
    "--declarationMap",
    "false",
    "--inlineSourceMap",
    "false",
    "--inlineSources",
    "false",
  ]);
}

function alterPackageJson() {
  const pj = require("../package.json");
  console.log("pj");
}

function main() {
  lint();
  alterPackageJson();
  shrinkwrap();
  uploadGit();
  recompileSource();
}

main();
