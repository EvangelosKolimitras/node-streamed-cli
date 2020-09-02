/* ******* UTILS ******** */

const Transform = require("stream").Transform
const fs = require("fs");
const path = require("path");
const zlib = require("zlib")
const tab2 = () => "\t\t";

const processFile = (args, stream, base_path) => {
    let incomingStream = stream;
    let outputFile = path.join(base_path, "output.txt");
    let target; /* Target is the file a user specifies in stdin */

    // Transorm the stream during piping 
    const transformedStream = new Transform({
        transform(chunk, encoding, next) {
            this.push(chunk.toString().toUpperCase());
            next();
        }
    })
    if (args.comp) { /* compress if user specifies --comp in the command line */
        let gzipStream = zlib.createGzip();

        // Compresses the incomingStream
        incomingStream = incomingStream.pipe(gzipStream)
        outputFile = `${outputFile}.gzip`;
    }

    if (args.out) target = process.stdout
    else target = fs.createWriteStream(outputFile)

    // Gets the inputed stream from stdin, transforms it, and sends it to stdout
    incomingStream = incomingStream.pipe(transformedStream).pipe(target)
}

const printHelp = () => console.log(`Usage:
    --help             ${tab2()} Get help
    --file={filename}  ${tab2()} process the file
    --in, -            ${tab2()} process stdin
    -- out             ${tab2()} prints to the stdout
    -- comp            ${tab2()} gzip compression output
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