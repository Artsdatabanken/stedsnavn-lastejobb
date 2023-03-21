const execSync = require("child_process").execSync;
const { dops } = require("@artsdatabanken/lastejobb");

/* reproject(
  "Basisdata_0000_Norge_25833_Stedsnavn_GML.gml",
  "4326.geojson",
  "EPSG:4326"
);

function reproject(src, target, epsg = "EPSG:25833") {
  const docker = "docker run --rm -v /home:/home osgeo/gdal:alpine-small-latest"
  const pwd = process.env.PWD
  const cmd = `ogr2ogr -f GeoJSON -t_srs ${epsg} ${pwd}/temp/${target} ${pwd}/temp/${src}`

  execSync(docker + " " + cmd);
} */

var n = dops.start_gdal(dops.create_container_name('reproject'), 'temp');

const src = '/tmp/Basisdata_0000_Norge_25833_Stedsnavn_GML.gml';
const target = '/tmp/4326.geojson';
const epsg = 'EPSG:4326';

const cmd = `ogr2ogr -f GeoJSON -t_srs ${epsg} ${target} ${src}`

dops.exec_docker(n, cmd);

