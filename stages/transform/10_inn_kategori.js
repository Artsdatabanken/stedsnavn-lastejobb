const oboe = require("oboe");
const fs = require("fs");
const lastejobb = require("@artsdatabanken/lastejobb");

let count = 1;

const kategori = {};

function add(l1, l2, l3) {
  if (!kategori[l1]) kategori[l1] = {};
  const x1 = kategori[l1];
  if (!x1[l2]) x1[l2] = {};
  const x2 = x1[l2];
  if (x2[l3]) return x2[l3];
  x2[l3] = ++count;
}

oboe(fs.createReadStream("./temp/4326.geojson", { encoding: "utf8" }))
  .node("features.*", function(e) {
    const p = e.properties;
    add(p.navneobjekthovedgruppe, p.navneobjektgruppe, p.navneobjekttype);
    return oboe.drop;
  })
  .done(() => {
    lastejobb.io.skrivDatafil("inn_kategori", kategori);
  });
