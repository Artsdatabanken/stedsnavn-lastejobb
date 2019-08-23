if (!process.env.DEBUG) process.env.DEBUG = "*";
const { kjørLastejobberUnder } = require("lastejobb");

process.env.BUILD = "./build";

kjørLastejobberUnder("steg/");
