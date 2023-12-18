import libnpmpublish from "libnpmpublish";
import "dotenv/config";

const resp = await fetch("https://registry.npmjs.org/-/user/ktibow/package");
const json = await resp.json();
const packages = Object.keys(json).filter((p) =>
  p.startsWith("@ktibow/iconset-")
);

let i = 0;
packages.map(async (p) => {
  await libnpmpublish.unpublish(p, {
    forceAuth: {
      token: process.env.NPM_TOKEN,
    },
  });
  console.log(`${++i}/${packages.length} ${p}`);
});
