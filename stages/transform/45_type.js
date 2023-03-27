const { io, url } = require("@artsdatabanken/lastejobb");

main();

function main() {
    const r = io.lesTempJson("alle");
    new url(r).assignUrls();
    io.skrivBuildfil("type.json", r);
}