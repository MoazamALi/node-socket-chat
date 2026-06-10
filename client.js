const net = require("node:net");
const { Writable } = require("node:stream");
function log(message) {
  process.stdout.write(`\r${message}\n`);
}
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    const data = JSON.parse(chunk.toString());
    const id = data.id;
    const message = data.message;
    if (message) {
      log(`${id}: ${message}`);
    } else {
      log(`${id} connected`);
    }
    log(`Type something...`);
    callback(null, chunk);
  },
});

process.stdin.pipe(net.connect(3000)).pipe(myWritable);
