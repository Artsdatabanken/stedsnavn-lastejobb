set -e # exit when any command fails

mkdir data
cd data
wget https://nedlasting.geonorge.no/geonorge/Basisdata/Stedsnavn/GML/Basisdata_0000_Norge_25833_Stedsnavn_GML.zip
unzip Basisdata_0000_Norge_25833_Stedsnavn_GML.zip
rm Basisdata_0000_Norge_25833_Stedsnavn_GML.zip
ogr2ogr -t_srs EPSG:4326 -f GeoJSON 4326.geojson Basisdata_0000_Norge_25833_Stedsnavn_GML.gml
cd ..
