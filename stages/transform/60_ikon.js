const { io } = require("lastejobb");

let ikoner = io.findFiles("temp/icons", ".svg");
ikoner = ikoner.filter(x => x.indexOf("48px.svg") > 0);
io.skrivDatafil("material", ikoner);
