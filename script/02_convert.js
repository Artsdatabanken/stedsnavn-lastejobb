const oboe = require("oboe");
const fs = require("fs");
const category = require("./category");
const keys = {};
const typer = category.create();

function round_to_precision(x, precision) {
  const scaler = Math.pow(10, precision);
  return Math.round(x * scaler) / scaler;
}

const ws = fs.createWriteStream("o.json");
oboe(fs.createReadStream("./data/4326.geojson", { encoding: "utf8" }))
  .node("features.*", function(e) {
    if (e.geometry.type !== "Point") return oboe.drop;
    if (!e.properties.langnavn) return oboe.drop;
    junkprops.forEach(key => delete e.properties[key]);
    const props = e.properties;
    Object.keys(props).forEach(k => {
      if (k.indexOf("|") > 0) {
        delete props[k];
      } else if (!keys[k]) {
        keys[k] = true;
        console.warn('"' + k + '",');
      }
    });
    props.sortering1Kode = props.sortering1Kode.replace("viktighet", "");
    props.s = props.sortering1Kode;
    delete props.sortering1Kode;
    delete props.sortering2Kode;
    props.l =
      props.navneobjekthovedgruppe +
      "_" +
      props.navneobjektgruppe +
      "_" +
      props.navneobjekttype;
    const category = typer.add(props.l);
    if (!typer[props.l]) typer[props.l] = true;
    delete props.navneobjekthovedgruppe;
    delete props.navneobjektgruppe;
    delete props.navneobjekttype;
    props.navn = props.langnavn;
    delete props.langnavn;
    //    props.coord = e.geometry.coordinates.map(x => Math.round(x));
    props.coord = e.geometry.coordinates;
    if (props.coord[0] == 229378 && props.coord[1] == 6950049) return oboe.drop; // Feilplassert
    if (props.coord[0] == 107355 && props.coord[1] == 7008055) return oboe.drop; // Feilplassert
    if (props.coord[0] == 66042 && props.coord[1] == 6946751) return oboe.drop; // Feilplassert
    if (props.coord[0] == -40747 && props.coord[1] == 6651079) return oboe.drop; // Feilplassert
    if (props.coord[0] == -50210 && props.coord[1] == 6772591) return oboe.drop; // Feilplassert
    if (props.coord[0] == -40879 && props.coord[1] == 6650995) return oboe.drop; // Feilplassert

    //    if (props.språk[0] !== "nor") console.log(props);
    const x = `${props.s}${category} ${round_to_precision(
      props.coord[0],
      5
    )}  ${round_to_precision(props.coord[1], 5)}  ${props.navn[0]}`;

    ws.write(x + "\n");
    return oboe.drop;
  })
  .done(() => {
    ws.close();
    fs.writeFileSync("typer.json", JSON.stringify(typer));
  });

const junkprops = [
  "år",
  "arkivløpenummer",
  "arkivreferanse",
  "beskrivelse",
  "dokumentdato",
  "dokumenttype",
  "eksonym",
  "forfatter",
  "funksjonstillegg",
  "fylkesnavn",
  "stedsnummer",
  "fylkesnummer",
  "gml_id",
  "kortnavn",
  "informant",
  "innsamler",
  "isbn",
  "kartblad",
  "kasusTilKjernenavn",
  "kildedato",
  "klagedato",
  "kommunenavn",
  "kommunenummer",
  "kortBeskrivelse",
  "land",
  "lokalId",
  "navnerom",
  "navnesakstatus",
  "navnestatus",
  "offentligBruk",
  "oppdateringsdato",
  "opphavsspråk",
  "prioritertSkrivemåte",
  "produktkode",
  "referansetekst",
  "registreringsdato",
  "rekkefølge",
  "rekkefølge",
  "saksnummer",
  "side",
  "kjernenavn",
  "språkprioritering",
  "skrivemåtenummer",
  "skrivemåtestatus",
  "skrivemåtestatus",
  "språk",
  "statusdato",
  "stedsnavnnummer",
  "stedstatus",
  "tekst",
  "tilleggsopplysninger|Tilleggsopplysning|oppdateringsdato",
  "tilleggsopplysninger|Tilleggsopplysning|registreringsdato",
  "tilleggsopplysninger|Tilleggsopplysning|tekst",
  "tilleggsopplysninger|Tilleggsopplysning|tilleggsopplysningstype",
  "tilleggsopplysningstype",
  "tittel",
  "utgått",
  "utgave",
  "utgivelsesår",
  "utgivelsesår",
  "utgiver",
  "variasjonstillegg",
  "vedtaksdato",
  "vedtaksmyndighet",
  "vedtattAv"
];
