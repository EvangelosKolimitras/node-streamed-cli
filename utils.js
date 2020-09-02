/* ******* UTILS ******** */

const Transform = require("stream").Transform
const fs = require("fs");
const path = require("path");

const tab2 = () => "\t\t";

const processFile = (args, stream, base_path) => {
    const incomingStream = stream;
    const transformedStream = new Transform({
        transform(chunk, encoding, next) {
            this.push(chunk.toString().toUpperCase());
            next();
        }
    })
    let target; /* Target is the file a user specifies in stdin */
    if (args.out) target = process.stdout
    else target = fs.createWriteStream(path.join(base_path, "output.txt"))

    // Gets the inputed stream from stdin, transforms it, and sends it to stdout
    incomingStream.pipe(transformedStream).pipe(target)
}

const printHelp = () => console.log(`Usage:
    --help             ${tab2()} Get help
    --file={filename}  ${tab2()} process the file
    --in, -            ${tab2()} process stdin
    -- out,            ${tab2()} prints to the stdout
   `);
const erroring = (msg, includeHelp = false) => {
    console.error(msg);
    if (includeHelp) {
        console.log("")
        printHelp();
    }
}
module.exports = {
    processFile, printHelp, erroring
}