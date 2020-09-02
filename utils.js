/* ******* UTILS ******** */

const Transform = require("stream").Transform
const tab2 = () => "\t\t";
const processFile = stream => {
    const incomingStream = stream;
    const transformedStream = new Transform({
        transform(chunk, encoding, next) {
            this.push(chunk.toString().toUpperCase());
            next();
        }
    })
    incomingStream.pipe(transformedStream).pipe(process.stdout)
}
const printHelp = () => console.log(`Usage:
    --help             ${tab2()} Get help
    --file={filename}  ${tab2()} process the file
    --in, -            ${tab2()} process stdin
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