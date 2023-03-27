const lastejobb = require("@artsdatabanken/lastejobb");

const typer = lastejobb.io.lesTempJson("inn_kategori.json");

const kode2autor = {};
const autor2kode = {};
const steder_kategori = [];

main();

function main() {
  assignKode(typer);
  lastejobb.io.skrivDatafil("kode2autor", kode2autor);
  lastejobb.io.skrivDatafil("autor2kode", autor2kode);
  lastejobb.io.skrivBuildfil("steder_kategori", steder_kategori);

  function assignKode(src, prefix = "SN") {
    const keys = Object.keys(src).sort((a, b) => a.length - b.length);
    keys.forEach(kodeAutor => {
      const kode = makeCode(prefix, kodeAutor);
      kode2autor[kode] = kodeAutor;
      autor2kode[kodeAutor] = kode;
      const id = src[kodeAutor];
      if (typeof id === "number") steder_kategori.push({ id: id, kode: kode });

      assignKode(src[kodeAutor], kode);
    });
  }

  function makeCode(prefix, key) {
    key = splitWords(key);
    let r = prefix && prefix + "-";
    for (var i = 0; i < key.length; i++) {
      const ch = key[i];
      if (ch !== ch.toUpperCase()) continue;
      if (ch === " ") continue;
      r += ch;
      if (!kode2autor[r]) return r;
    }

    for (var i = 1; i <= key.length; i++) {
      let r = prefix && prefix + "-";
      r += key.substring(0, i).toUpperCase();
      if (!kode2autor[r]) return r;
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
}