const oboe = require("oboe");
const fs = require("fs");
const category = require("../category");
const lastejobb = require("lastejobb");

const typer = category.create();

function round_to_precision(x, precision) {
  const scaler = Math.pow(10, precision);
  return Math.round(x * scaler) / scaler;
}

lastejobb.io.mkdir("build");
const ws = fs.createWriteStream("build/steder.json");
oboe(fs.createReadStream("./data/4326.geojson", { encoding: "utf8" }))
  .node("features.*", function(e) {
    if (e.geometry.type !== "Point") return oboe.drop;
    const p = e.properties;
    if (!p.komplettskrivemåte) return oboe.drop;
    const category = typer.add(
      p.navneobjekthovedgruppe,
      p.navneobjektgruppe,
      p.navneobjekttype
    );
    const coord = e.geometry.coordinates;
    if (coord[0] == 229378 && coord[1] == 6950049) return oboe.drop; // Feilplassert
    if (coord[0] == 107355 && coord[1] == 7008055) return oboe.drop; // Feilplassert
    if (coord[0] == 66042 && coord[1] == 6946751) return oboe.drop; // Feilplassert
    if (coord[0] == -40747 && coord[1] == 6651079) return oboe.drop; // Feilplassert
    if (coord[0] == -50210 && coord[1] == 6772591) return oboe.drop; // Feilplassert
    if (coord[0] == -40879 && coord[1] == 6650995) return oboe.drop; // Feilplassert

    const stedsnummer = p.stedsnavnnummer[0] - 1;
    const x = p.komplettskrivemåte;
    const y = p["komplettskrivemåte"];
    const navn = p.komplettskrivemåte[stedsnummer];
    const line = `${p.sortering.replace(
      "viktighet",
      ""
    )}${category} ${round_to_precision(coord[0], 5)} ${round_to_precision(
      coord[1],
      5
    )} ${navn}`;

    ws.write(line + "\n");
    return oboe.drop;
  })
  .done(() => {
    ws.close();
    lastejobb.io.skrivDatafil("typer.json", typer);
  });
