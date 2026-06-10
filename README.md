# Episode 91 — TCP Broadcast Chat

A minimal multi-client chat built on raw TCP sockets using only Node.js core modules (`net`, `stream`, `crypto`). The server keeps track of connected clients and broadcasts each message it receives to everyone *except* the sender.

## How it works

- **Server** (`server.js`) listens on port `3000`. On each connection it assigns a random UUID, stores the socket in a `Map`, and sends the new client its short id. Incoming data is piped through a `Writable` stream that wraps each chunk as JSON (`{ id, message }`) and broadcasts it to all other clients.
- **Client** (`client.js`) connects to `localhost:3000`, pipes your terminal input (`stdin`) to the server, and renders incoming JSON messages as `id: message`.

The message envelope sent over the wire looks like:

```json
{ "id": "a1b2c", "message": "hello" }
```

## Requirements

- Node.js 18+ (uses `node:` core imports and `randomUUID`)

## Usage

Start the server:

```bash
npm start
# or
node server.js
```

Open one or more client terminals:

```bash
node client.js
```

Type a message in any client and press Enter — it will appear in every other connected client.

## Files

| File          | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `server.js`   | TCP server: tracks clients and broadcasts messages.  |
| `client.js`   | TCP client: sends stdin, prints incoming messages.   |
| `package.json`| Project metadata and the `start` script.             |
# node-socket-chat
