const { git } = require("@artsdatabanken/lastejobb");
const { processes } = require("@artsdatabanken/lastejobb/lib");

let pwd = process.env.PWD;
try{
let cmd = `rm -rf ${pwd}/temp/icons`;
console.log("cmd var: ", cmd);
processes.exec(cmd);
}catch(e){
    console.log("No directory to remove so ok i guess...continuing")
}
git.clone("https://github.com/google/material-design-icons/", "temp/icons");

