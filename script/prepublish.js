// npm run lint && npm shrinkwrap && git add . && git push && rm -rf ./dist && tsc --declarationMap false --inlineSourceMap false --inlineSources false
//

const cp = require("child_process");

function lint(fix = true) {
  cp.spawnSync("npm", ["run", fix ? "fix-lint" : "lint"], {stdio: "inherit"});
}

function shrinkwrap() {
  cp.spawnSync("npm", ["shrinkwrap"]);
}

function uploadGit() {
  cp.spawnSync("git", ["add", "."]);
  cp.spawnSync("git", ["commit", "-m", "prepare for publish"]);
  cp.spawnSync("git", ["push"]);
}

function recompileSource() {
  cp.spawnSync("rm", ["-rf", "./dist"]);
  cp.spawnSync("tsc", [
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
