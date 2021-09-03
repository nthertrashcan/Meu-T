require("events").EventEmitter.defaultMaxListeners = 15;
const express = require("express");
const app = express();
const server = require("http").Server(app);
const { PeerServer } = require("peer");
const io = require("socket.io")(server);

const peerServer = new PeerServer({ port: 3001, path: "/" });

io.sockets.setMaxListeners(10);
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

io.on("user-disconnected", (socket, id) => {
  socket.to(roomId).emit("user-disconnected", id);
});

peerServer.on("connection", (id) => {
  console.log(id.id, "joined.");
});

peerServer.on("disconnect", function (id) {
  io.emit("user-disconnected", id.id);
  console.log(id.id, "disconnected.");
});

const port = process.env.PORT || 8000;
console.log(`Listening at ${port}`);
server.listen(port);
