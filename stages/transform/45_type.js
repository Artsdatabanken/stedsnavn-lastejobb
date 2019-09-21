const { io, url } = require("lastejobb");

const r = io.lesDatafil("alle");
new url(r).assignUrls();
io.skrivBuildfil("type.json", r);
