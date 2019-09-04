const cp = require("child_process");

function spawnSync(cmd, args) {
  return cp.spawnSync(cmd, args, {stdio: "inherit"});
}

function shrinkwrap() {
  console.log("Making shrinkwrap...");
  spawnSync("npm", ["shrinkwrap"]);
}

module.exports = {spawnSync, shrinkwrap};
