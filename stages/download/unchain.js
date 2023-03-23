const fs = require("fs");



const stedsnavn = "./temp/stedsnavn.zip";
const basisUnzipped = "./temp/Basisdata_0000_Norge_25833_Stedsnavn_GML.gml";


let basisInfo = fs.statSync(basisUnzipped);
let basisSize = basisInfo.size / (1024*1024);
console.log("Basisdata size: ", basisSize);

let stedsnavnInfo = fs.statSync(stedsnavn);
let stedsnavnSize = stedsnavnInfo.size / (1024*1024);
console.log("Zip file size: ", stedsnavnSize);