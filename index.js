#!/usr/bin/env node
"use-strict"
const util = "util"
const path = require("path");
const fs = require("fs");

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname)
const args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out", "comp", "ucomp"],
    string: ["file"],
});

const { erroring, printHelp, processFile } = require("./utils");

if (args.help || process.argv.length <= 2) {
    erroring(null, true); // <-- Prints help
} else if (args.in || args._.includes("-")) {
    processFile({ stream: process.stdin });
} else if (args.file) {
    processFile({ args, stream: fs.createReadStream(path.join(BASE_PATH, args.file)), base_path: BASE_PATH });
} else {
    erroring("Incorrect usage", true); // < --Prints help
}