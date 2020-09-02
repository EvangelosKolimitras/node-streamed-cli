#!/usr/bin/env node
"use-strict"
const util = "util"
const path = require("path");
const fs = require("fs");


const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname)
const args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out", "comp"],
    string: ["file"],
});

const { erroring, printHelp, processFile } = require("./utils");

if (args.help) return printHelp();
if (args.in || args._.includes("-")) return processFile(process.stdin);
if (args.file) return processFile(args, fs.createReadStream(path.join(BASE_PATH, args.file)), BASE_PATH);

erroring("Incorrect usage", true);