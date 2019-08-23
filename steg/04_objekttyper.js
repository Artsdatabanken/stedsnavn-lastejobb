const lastejobb = require("lastejobb");
const fs = require("fs");
var parseString = require("xml2js").parseString;

const autor2kode = {};
const kode2autor = {};

// Ustabil link, manuell download: https://register.geonorge.no/register/versjoner/produktspesifikasjoner/kartverket/stedsnavn-for-vanlig-bruk (GML-skjema)
const xsd = fs.readFileSync("kildedata/StedsnavnForVanligBruk.xsd", "utf8");

const r = {};

parseString(xsd, function(err, result) {
  const schema = result.schema;
  schema.simpleType.forEach(t => map(t));
  lastejobb.io.skrivDatafil("objektyper.json", r);
});

function map(t) {
  const name = t["$"].name.replace("EnumerationType", "");
  if (name.indexOf("Navneobjekt") < 0) return;
  if (!t.restriction) return;
  if (!t.annotation) return;
  const nivå = t.annotation[0].documentation[0];
  mapEnum(t.restriction[0].enumeration, nivå);
}

function mapEnum(t, nivå) {
  return t.map(src => {
    const kodeautor = src["$"].value;
    const e = {
      //      kode: getKode(forelder.kodeautor, kodeautor),
      kodeautor,
      nivå
    };
    if (src.annotation) {
      const doc = src.annotation[0].documentation[0].split(":");
      if (doc[1]) e.ingress = doc[1].trim();
      e.tittel = doc[0].trim();
    }
    if (r[e.kodeautor]) throw new Error();
    r[e.kodeautor] = e;
  });
}

function getKode(nivå, kodeautor) {
  if (!autor2kode[nivå]) autor2kode[nivå] = {};
  const dict = autor2kode[nivå];
  const ka = kodeautor.toUpperCase();
  if (dict[kodeautor]) throw new Error();
  for (let x = 0; x < ka.length - 2; x++)
    for (let y = x + 1; y < ka.length - 1; y++) {
      const kode = ka[x] + ka[y];
      if (!kode2autor[kode]) {
        kode2autor[kode] = kodeautor;
        autor2kode[kodeautor] = kode;
        return kode;
      }
    }
  throw new Error();
}
