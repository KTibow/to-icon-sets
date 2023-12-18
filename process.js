import { promisify } from "util";
import { exec } from "child_process";
import { existsSync } from "fs";
import { readFile, readdir, mkdir, rm } from "fs/promises";
import { IconSet, exportIconPackage } from "@iconify/tools";

console.log("updating icons...");
const execP = promisify(exec);
if (existsSync("icon-sets")) {
  await execP("git -C icon-sets pull");
} else {
  await execP(
    "git clone https://github.com/iconify/icon-sets icon-sets --depth=1 --branch=master"
  );
}
console.log("finished updating icons");

if (existsSync("icon-sets-output"))
  await rm("icon-sets-output", { recursive: true });
await mkdir("icon-sets-output");

const process = async (name) => {
  const rawData = JSON.parse(
    await readFile(`icon-sets/json/${name}.json`, "utf8")
  );

  const iconSet = new IconSet(rawData);
  if (iconSet.count() == 0) {
    console.log(`skipping ${name}`);
    return;
  }

  const version = rawData.info.version
    ? rawData.info.version
    : rawData.lastModified
    ? `0.0.${rawData.lastModified}`
    : null;
  if (!version) {
    throw new Error(`version missing for ${name}`);
  }

  console.log(`processing ${name}`);
  await exportIconPackage(iconSet, {
    target: `icon-sets-output/${name}`,
    module: true,
    package: {
      name: `@ktibow/iconset-${name}`,
      version,
      homepage: "https://github.com/KTibow/to-icon-sets",
      license: rawData.info.license.spdx,
    },
  });
};

const sets = await readdir("icon-sets/json");
let i = 0;
console.log("starting...");
sets.map(async (set) => {
  const name = set.replace(".json", "");
  await process(name);
  console.log(`${++i}/${sets.length} ${name}`);
});
