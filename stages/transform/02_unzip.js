const { processes } = require("@artsdatabanken/lastejobb/lib");
const log = require("@artsdatabanken/lastejobb/lib/log");
const fs = require("fs");


main();

function main() {
    let pwd = process.env.PWD;
    //archive.unzip("stedsnavn.zip");
    console.log("pwd var: "+pwd);
    processes.exec(`unzip -u ./temp/stedsnavn -d ${pwd}/temp/`);
    const basisUnzipped = "/temp/Basisdata_0000_Norge_25833_Stedsnavn_GML.gml";

    log.info("Current directory: " + pwd)

    try {
        let basisInfo = fs.statSync(pwd + "/" + basisUnzipped);
        let basisSize = basisInfo.size / (1024*1024);
        log.info("Basisdata size: " + basisSize);    
    } catch (err) {
        let basi = pwd += "/temp";
        fs.readdir(basi, (err, files) => {
            if (err)
            console.log(err);
            else {
            console.log("\nCurrent directory filenames:");
            files.forEach(file => {
                console.log(file);
            })
            }
        })
    }
}


