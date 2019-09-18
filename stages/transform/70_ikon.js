const { io, log } = require("lastejobb");
const fs = require("fs");

const ikonTarget = "build/ikon";
if (!fs.existsSync(ikonTarget)) fs.mkdirSync(ikonTarget);

let ikoner = io.lesDatafil("material").items;
let autor2kode = io.lesDatafil("autor2kode");

const r = [];

let a2m = io.lesDatafil("stedsnavn-ubehandlet/autorkode2materialicon");
Object.keys(a2m).forEach(autorkode => {
  const kode = autor2kode[autorkode];
  const ikonnavn = a2m[autorkode];
  const ikonpath = finnIkon(ikonnavn);
  if (!ikonpath) return log.warn("Finner ikke ikon " + ikonnavn);
  r.push({ kode: kode, ikon: ikonpath });
  fs.copyFileSync(ikonpath, ikonTarget + "/" + kode + ".svg");
});
io.skrivDatafil("ikon", r);

function finnIkon(navn) {
  for (ikon of ikoner) if (ikon.indexOf(navn) >= 0) return ikon;
}
