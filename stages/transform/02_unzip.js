const { archive } = require("@artsdatabanken/lastejobb");
const log = require("@artsdatabanken/lastejobb/lib/log");
const fs = require("fs");

archive.unzip("stedsnavn.zip");

const basisUnzipped = "temp/Basisdata_0000_Norge_25833_Stedsnavn_GML.gml";
let pwd = process.env.PWD;
log.info("Current directory: " + pwd)

try {
    let basisInfo = fs.statSync(pwd + "/" + basisUnzipped);
    let basisSize = basisInfo.size / (1024*1024);
    log.info("Basisdata size: " + basisSize);    
} catch (error) {
    log.info("Error when reading folder!!!!!!: " + error);
    let cont = fs.readdir(pwd, console.log(error));
    log.info("There was an error reading gml, file - contents of folder is: " + cont);
}



