// git push --follow-tags &&

const {spawnSync, shrinkwrap, uploadGit} = require("./utils");

const fs = require("fs");
const path = require("path");

function uploadGitTag() {
  console.log("Committing git tag...");
  spawnSync("git", ["push", "--follow-tags"]);
}

function revertPackageJson() {
  console.log("Reverting package.json...");
  fs.renameSync(
    path.resolve(__dirname, "../package.original.json"),
    path.resolve(__dirname, "../package.json")
  );
  fs.unlink(path.resolve(__dirname, "../package.original.json"));
}

function main() {
  uploadGitTag();
  revertPackageJson();
  shrinkwrap();
  uploadGit();
}

main();
