const execSync = require("child_process").execSync;

reproject(
  "Basisdata_0000_Norge_25833_Stedsnavn_GML.gml",
  "4326.geojson",
  "EPSG:4326"
);

function reproject(src, target, epsg = "EPSG:25833") {
  execSync(`ogr2ogr -f GeoJSON -t_srs ${epsg} temp/${target} temp/${src}`);
}
