const { io, url } = require("@artsdatabanken/lastejobb");

const r = io.lesTempJson("alle");
new url(r).assignUrls();
io.skrivBuildfil("type.json", r);
