const net = require("node:net");
const { randomUUID } = require("node:crypto");
const { Writable } = require("node:stream");
const clients = new Map();

const boardcast = (sender, message) => {
  [...clients.values()]
  .filter((client) => client !== sender)
  .forEach((client) => {
    client.write(message);
  });
};

const boardcastViaStream = (socket) => {
  return new Writable({
    write(chunk, encoding, callback) {

      const data = JSON.stringify({
        id: socket.id.slice(0, 5),
        message: chunk.toString(),
      });

      boardcast(socket, data);

      callback(null, chunk);
    },
  });
};

const server = net.createServer((socket) => {
  socket.pipe(boardcastViaStream(socket));
});

server.on("connection", (socket) => {
  const clientId = randomUUID();
  socket.id = clientId;
  clients.set(clientId, socket);
  socket.write(JSON.stringify({ id: clientId.slice(0, 5) }));

  socket.on("close", () => {
    clients.delete(clientId);
    console.log(`Client disconnected ${clientId}`);
  });
});

server.on("error", (error) => {
  console.error(error);
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
