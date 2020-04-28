const oboe = require("oboe");
const fs = require("fs");
const { io } = require("lastejobb");

const kategori2id = io.lesTempJson("inn_kategori");

function round_to_precision(x, precision) {
  const scaler = Math.pow(10, precision);
  return Math.round(x * scaler) / scaler;
}

io.mkdir("build");
const ws = fs.createWriteStream("temp/steder.txt");
oboe(fs.createReadStream("./temp/4326.geojson", { encoding: "utf8" }))
  .node("features.*", function (e) {
    if (e.geometry.type !== "Point") return oboe.drop;
    const p = e.properties;
    if (!p.komplettskrivemåte) return oboe.drop;
    const categoryId =
      kategori2id[p.navneobjekthovedgruppe][p.navneobjektgruppe][
      p.navneobjekttype
      ];

    const coord = e.geometry.coordinates;
    if (coord[0] == 229378 && coord[1] == 6950049) return oboe.drop; // Feilplassert
    if (coord[0] == 107355 && coord[1] == 7008055) return oboe.drop; // Feilplassert
    if (coord[0] == 66042 && coord[1] == 6946751) return oboe.drop; // Feilplassert
    if (coord[0] == -40747 && coord[1] == 6651079) return oboe.drop; // Feilplassert
    if (coord[0] == -50210 && coord[1] == 6772591) return oboe.drop; // Feilplassert
    if (coord[0] == -40879 && coord[1] == 6650995) return oboe.drop; // Feilplassert

    const stedsnavnnummer = p.stedsnavnnummer[0] - 1;
    const navn = p.komplettskrivemåte[stedsnavnnummer];
    const viktighet = p.sortering.replace("viktighet", "");
    const lng = round_to_precision(coord[0], 5);
    const lat = round_to_precision(coord[1], 5);
    const line = `${p.stedsnummer} ${viktighet}${categoryId} ${lng} ${lat} ${navn}`;

    ws.write(line + "\n");
    return oboe.drop;
  })
  .done(() => {
    ws.close();
  });
