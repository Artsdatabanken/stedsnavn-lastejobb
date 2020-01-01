const oboe = require("oboe");
const fs = require("fs");
const { io } = require("lastejobb");

io.mkdir("build");
const geoj = {
  type: "FeatureCollection",
  name: "Sted",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::4326" } },
  features: []
};

oboe(fs.createReadStream("./temp/4326.geojson", { encoding: "utf8" }))
  .node("features.*", function(e) {
    if (e.geometry.type !== "Point") return oboe.drop;
    const p = e.properties;
    if (!p.komplettskrivemåte) return oboe.drop;

    const coord = e.geometry.coordinates;
    if (coord[0] == 229378 && coord[1] == 6950049) return oboe.drop; // Feilplassert
    if (coord[0] == 107355 && coord[1] == 7008055) return oboe.drop; // Feilplassert
    if (coord[0] == 66042 && coord[1] == 6946751) return oboe.drop; // Feilplassert
    if (coord[0] == -40747 && coord[1] == 6651079) return oboe.drop; // Feilplassert
    if (coord[0] == -50210 && coord[1] == 6772591) return oboe.drop; // Feilplassert
    if (coord[0] == -40879 && coord[1] == 6650995) return oboe.drop; // Feilplassert

    /*    if (
      p.navneobjekthovedgruppe !== "flyplass" ||
      p.navneobjektgruppe !== "flyplasss" ||
      p.navneobjekttype !== "flyplass"
    )
      return oboe.drop;*/
    if (
      p.navneobjekthovedgruppe !== "bebyggelse" ||
      p.navneobjektgruppe !== "institusjoner" ||
      p.navneobjekttype !== "sykehus"
    )
      return oboe.drop;
    geoj.features.push(e);
    return oboe.drop;
  })
  .done(() => {
    fs.writeFileSync("flyplass_4326.geojson", JSON.stringify(geoj));
  });
