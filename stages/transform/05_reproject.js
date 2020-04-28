const execSync = require("child_process").execSync;

reproject(
  "Basisdata_0000_Norge_25833_Stedsnavn_GML.gml",
  "4326.geojson",
  "EPSG:4326"
);

function reproject(src, target, epsg = "EPSG:25833") {
  const docker = "docker run --rm -v /home:/home osgeo/gdal:alpine-small-latest"
  const pwd = process.env.PWD
  const cmd = `ogr2ogr -f GeoJSON -t_srs ${epsg} ${pwd}/temp/${target} ${pwd}/temp/${src}`

  execSync(docker + " " + cmd);
}
