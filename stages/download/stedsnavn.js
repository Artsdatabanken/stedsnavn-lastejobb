const { http, log } = require("@artsdatabanken/lastejobb");

http
  .downloadBinary(
    "https://nedlasting.geonorge.no/geonorge/Basisdata/Stedsnavn/GML/Basisdata_0000_Norge_25833_Stedsnavn_GML.zip",
    "stedsnavn.zip"
  )
  .catch(err => {
    log.fatal(err);
  });

//const basisUnzipped = "./temp/Basisdata_0000_Norge_25833_Stedsnavn_GML.gml";


//let basisInfo = fs.statSync(basisUnzipped);
//let basisSize = basisInfo.size / (1024*1024);
//log.info("Basisdata size: ", basisSize);

