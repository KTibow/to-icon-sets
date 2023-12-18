import { publish } from "libnpmpublish";
import { readdir } from "fs/promises";
import pacote from "pacote";
import Arborist from "@npmcli/arborist";
import { resolve } from "path";
import "dotenv/config";

const p = async (name) => {
  const path = resolve("icon-sets-output", name);

  const m = await pacote.manifest(path);
  const resp = await fetch(`https://registry.npmjs.org/${m.name}/latest`);
  if (resp.ok) {
    const json = await resp.json();
    if (json.version == m.version) {
      console.log(`skipping ${name}`);
      return;
    }
  }
  console.log(`processing ${name}`);

  const d = await pacote.tarball(path, { Arborist });

  console.log(`publishing ${name}`);
  await publish(m, d, {
    npmVersion: `${m.name}@${m.version}`,
    access: "public",
    forceAuth: {
      token: process.env.NPM_TOKEN,
    },
  });
};

const sets = await readdir("icon-sets-output");
let i = 0;
sets.map(async (set) => {
  await p(set);
  console.log(`${++i}/${sets.length} ${set}`);
});
