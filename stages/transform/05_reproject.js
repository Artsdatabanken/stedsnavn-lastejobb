const execSync = require("child_process").execSync;
const { dops } = require("@artsdatabanken/lastejobb");


main();

function main() {
  var n = dops.start_gdal(dops.create_container_name('reproject'), 'temp');

  const src = '/tmp/Basisdata_0000_Norge_25833_Stedsnavn_GML.gml';
  const target = '/tmp/4326.geojson';
  const epsg = 'EPSG:4326';
  const cmd = `ogr2ogr -f GeoJSON -t_srs ${epsg} ${target} ${src}`

  dops.exec_docker(n, cmd);
}
