const { io } = require("@artsdatabanken/lastejobb");

main();
function main() {
    let ikoner = io.findFiles("temp/icons", ".svg");
    ikoner = ikoner.filter(x => x.indexOf("24px.svg") > 0);
    io.skrivDatafil("material", ikoner);
}