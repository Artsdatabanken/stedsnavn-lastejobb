const lastejobb = require("lastejobb");
const fs = require("fs");

const steder = fs.readFileSync("build/steder.json", "utf8").split("\n");
const kat2kode = lesKat2kode();

function lesKat2kode() {
  const autorkode2index = lastejobb.io.lesDatafil("inn_kategori.json");
  const kode2autor = {};
  invert(kode2autor, autorkode2index);
  const autor2kode = lastejobb.io.lesDatafil("autor2kode.json");
  const s = {};
  Object.entries(kode2autor).forEach(([k, v]) => {
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
  if (sted.length < 5) return; // EOF
  const [kk, lng, lat, stedsnummer, ...navnArr] = sted;
  const kode = kat2kode[kk.substring(1)];
  const navn = navnArr.join(" ");
  if (!kode) debugger;
  if (navn === "Trondheim") debugger;
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
  const score = 900 - diff * 50;
  return score;
}
