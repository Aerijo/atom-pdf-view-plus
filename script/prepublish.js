// npm run lint && npm shrinkwrap && git add . && git push && rm -rf ./dist && tsc --declarationMap false --inlineSourceMap false --inlineSources false
//

const cp = require("child_process");

function spawnSync(cmd, args) {
  return cp.spawnSync(cmd, args, {stdio: "inherit"});
}

function lint(fix = true) {
  spawnSync("npm", ["run", fix ? "fix-lint" : "lint"]);
}

function shrinkwrap() {
  spawnSync("npm", ["shrinkwrap"]);
}

function uploadGit() {
  spawnSync("git", ["add", "."]);
  spawnSync("git", ["commit", "-m", "prepare for publish"]);
  spawnSync("git", ["push"]);
}

function recompileSource() {
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

function main() {
  lint();
  shrinkwrap();
  uploadGit();
  recompileSource();
}

main();
