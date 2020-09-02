/* ******* UTILS ******** */

const Transform = require("stream").Transform
const fs = require("fs");
const path = require("path");
const zlib = require("zlib")
const tab2 = () => "\t\t";

const processFile = ({ args: { comp, ucomp, out }, stream, base_path }) => {
    let incomingStream = stream;
    let outputFile = path.join(base_path, "output.txt");
    let target; /* Target is the file a user specifies in stdin */

    /* decompress if user specifies --ucomp in the command line */
    if (ucomp) incomingStream = incomingStream.pipe(zlib.createGunzip())

    /* compress if user specifies --comp in the command line */
    if (comp) {
        outputFile = `${outputFile}.gz`;
        const zipStream = zlib.createGzip()
        // Compresses the incomingStream
        incomingStream = incomingStream.pipe(zipStream)
    }

    if (out)
        target = process.stdout
    else
        target = fs.createWriteStream(outputFile)
    // Transforms the incoming stream
    incomingStream = incomingStream.pipe(transformedStream);

    incomingStream.pipe(target)
}

const printHelp = () => console.log(`Usage:
    --help             ${tab2()} Get help
    --file={filename}  ${tab2()} process the file
    --in, -            ${tab2()} process stdin
    -- out             ${tab2()} prints to the stdout
    -- comp            ${tab2()} gzip compression output
    -- ucomp           ${tab2()} gzip decompression output
   `);

const erroring = (msg, callHelp = false) => {
    process.exitCode = 1;
    console.error(msg);
    if (callHelp) {
        console.log("")
        printHelp();
    }
}

// Transorm the stream during piping 
const transformedStream = new Transform({
    transform(chunk, encoding, next) {
        this.push(chunk.toString().toUpperCase());
        next();
    }
})

module.exports = {
    processFile, printHelp, erroring
}