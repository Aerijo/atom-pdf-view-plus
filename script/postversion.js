// git push --follow-tags &&

const {spawnSync} = require("./utils");

function uploadGitTag() {
  console.log("Committing git tag...");
  spawnSync("git", ["push", "--follow-tags"]);
}

function main() {
  uploadGitTag();
}

main();
