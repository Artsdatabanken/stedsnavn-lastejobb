const lastejobb = require("lastejobb");
const log = lastejobb.log;
const fs = require("fs");

const steder = fs.readFileSync("build/steder.json", "utf8").split("\n");
const kat2kode = lesKat2kode();

function lesKat2kode() {
  const t = lastejobb.io.lesDatafil("typer.json");
  const r = {};
  invert(r, t);
  const autor2kode = lastejobb.io.lesDatafil("autor2kode.json");
  const s = {};
  Object.entries(r).forEach(([k, v]) => {
    const kode = autor2kode[v];
    s[k] = kode;
  });
  return s;
}

function invert(r, node) {
  Object.keys(node).forEach(key => {
    const v = node[key];
    if (v > 0) r[v] = key;
    else invert(r, v);
  });
}

const fti = {};

steder.forEach(s => index(s.split(" ")));
lastejobb.io.skrivBuildfil("full-text-index-sted.json", fti);

function index(sted) {
  if (sted.length <= 4) return; // EOF
  const [kk, lng, lat, stedsnummer, navn] = sted;
  const kode = kat2kode[kk.substring(1)];
  if (!kode) debugger;
  const prio = kk[0];
  fti[stedsnummer] = {
    hit: {
      kode: kode,
      url: `Sted?lng=${lng}&lat=${lat}`,
      title: navn
    },
    text: {
      [viktighetTilScore(prio)]: [navn]
    }
  };
}

function viktighetTilScore(v) {
  if (!v) debugger;
  const diff = "O".charCodeAt(0) - v.charCodeAt(0);
  const score = 1000 - diff * 30;
  return score;
}
