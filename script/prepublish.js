// npm run lint && npm shrinkwrap && git add . && git push && rm -rf ./dist && tsc --declarationMap false --inlineSourceMap false --inlineSources false
//

const cp = require("child_process");

function spawnSync(cmd, args) {
  return cp.spawnSync(cmd, args, {stdio: "inherit"});
}

function lint(fix = true) {
  console.log("Fixing lint issues...");
  spawnSync("npm", ["run", fix ? "fix-lint" : "lint"]);
}

function shrinkwrap() {
  console.log("Making shrinkwrap...");
  spawnSync("npm", ["shrinkwrap"]);
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

function main() {
  lint();
  shrinkwrap();
  uploadGit();
  recompileSource();
}

main();
