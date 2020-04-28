const { io } = require("lastejobb");
const fs = require("fs");

const steder = fs.readFileSync("build/steder.txt", "utf8").split("\n");
const kat2kode = lesKat2kode();

function lesKat2kode() {
  const autorkode2index = io.lesTempJson("inn_kategori.json");
  const kode2autor = {};
  invert(kode2autor, autorkode2index);
  const autor2kode = io.lesTempJson("autor2kode.json");

  const type = io.readJson("./build/type.json").items
  const r = {};
  type.forEach(e => (r[e.kode] = e));

  const s = {};
  Object.entries(kode2autor).forEach(([k, v]) => {
    const kode = autor2kode[v];
    const type = r[kode];
    if (!type) debugger;
    s[k] = type;
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
io.skrivBuildfil("full-text-index-sted.json", fti);

function index(sted) {
  if (sted.length < 5) return; // EOF
  const [stedsnummer, kk, lng, lat, ...navnArr] = sted;
  const type = kat2kode[kk.substring(1)];
  const navn = navnArr.join(" ");
  if (!type) debugger;
  const prio = kk[0];
  fti[stedsnummer] = {
    hit: {
      kode: type.kode,
      url: type.url,
      lng,
      lat, //+ `?lng=${lng}&lat=${lat}`,
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
