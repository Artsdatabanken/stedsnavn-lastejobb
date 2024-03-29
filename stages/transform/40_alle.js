const lastejobb = require("@artsdatabanken/lastejobb");
const log = lastejobb.log;
const fs = require("fs");
var parseString = require("xml2js").parseString;

const autor2kode = lastejobb.io.lesTempJson("autor2kode");

main();

function main() {
  // Ustabil link, manuell download: https://register.geonorge.no/register/versjoner/produktspesifikasjoner/kartverket/stedsnavn-for-vanlig-bruk (GML-skjema)
  const xsd = fs.readFileSync(
    "temp/stedsnavn-ubehandlet/StedsnavnForVanligBruk.xsd",
    "utf8"
  );

  const r = {
    SN: {
      tittel: { nb: "Sted" },
      nivå: "Steder",
      foreldre: [],
      farge: "#cecece"
    }
  };

  parseString(xsd, function (err, result) {
    const schema = result.schema;
    schema.simpleType.forEach(t => map(t));
    lastejobb.io.skrivDatafil("alle.json", r);
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
        kode: autor2kode[kodeautor],
        kodeautor,
        nivå
      };
      if (src.annotation) {
        const doc = src.annotation[0].documentation[0].split(":");
        if (doc[1]) e.ingress = { nb: doc[1].trim().replace(/\s\s/g, " ") };
        e.tittel = { nb: doc[0].trim() };
      }
      if (!e.kode) return log.warn("Mangler typen " + kodeautor);
      else e.foreldre = [forelder(e.kode)];

      try {
      if (r[e.kode]) throw new Error("Duplikat " + e.kode);
      } catch(error) {
        console.log("Duplikat " + e.kode)
      }
      r[e.kode] = e;
      delete e.kode;
    });
  }

  function forelder(kode) {
    if (!kode) debugger;
    const segs = kode.split("-");
    segs.pop();
    return segs.join("-");
  }

}