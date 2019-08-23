const lastejobb = require("lastejobb");

const typer = lastejobb.io.lesDatafil("typer.json");

const koder = {};

assignKode(typer);
lastejobb.io.skrivBuildfil("koder", koder);

function assignKode(src, prefix = "") {
  const keys = Object.keys(src).sort((a, b) => a.length - b.length);
  keys.forEach(key => {
    const kode = makeCode(prefix, key);
    if (!kode) debugger;
    assignKode(src[key], kode);
  });
}

function makeCode(prefix, key) {
  key = splitWords(key);
  let r = prefix && prefix + "-";
  if (key.indexOf("Kultur Institusjoner") >= 0) debugger;
  for (var i = 0; i < key.length; i++) {
    const ch = key[i];
    if (ch !== ch.toUpperCase()) continue;
    if (ch === " ") continue;
    r += ch;
    if (!koder[r]) {
      koder[r] = key;
      return r;
    }
  }

  for (var i = 1; i <= key.length; i++) {
    let r = prefix && prefix + "-";
    r += key.substring(0, i).toUpperCase();
    if (!koder[r]) {
      koder[r] = key;
      return r;
    }
  }

  throw new Error("Fant ingen brukandes kode for " + key);
}

function splitWords(key) {
  key = key.replace(/[A-ZÆØÅ]/g, c => " " + c.toUpperCase());
  key = key.replace(/\sI\s/g, " "); // uinteressant bokstav for koden, eks. "eid i sjø" => kode ES, istedet for EI
  key = key.replace(/\sTil\s/g, " ");

  const wordList = [
    "fjell",
    "topp",
    "dal",
    "terreng",
    "tettsted",
    "hall",
    "anlegg",
    "stasjon",
    "kryss",
    "strekning",
    "sving",
    "ferje",
    "skog",
    "felt",
    "bøye",
    "varde",
    "adresse",
    "blokk",
    "industri",
    "tømmer",
    "krets",
    "kultur",
    "skred",
    "kraft",
    "merke",
    "gruppe",
    "bebyggelse",
    "hav",
    "fjord",
    "halv"
  ];
  wordList.forEach(w => {
    key = key.replace(w, " " + w + " ");
  });
  const capitalized = (" " + key).replace(/\s[a-zæøå]/g, c => c.toUpperCase());

  return capitalized.trim();
}
