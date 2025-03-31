import net from "net";

/**
 * An array of clients, this array is a tuple array of the client ID and the socket.
 */
const clients: [number, net.Socket][] = [];
/**
 * Client ID
 */
let clientID = 1;

/**
 * This function creates a server that listens for incoming connections on port 60300.
 */
const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  console.log("Client connected");
  clients.push([clientID, socket]);
  ++clientID;
  let dataBuffer = "";
  socket.on("data", (data) => {
    dataBuffer += data.toString();
    const message = dataBuffer.split('\n');
    dataBuffer = "";
    socket.emit("response", JSON.parse(message[0]));
  });

  socket.on("response", (message: string) => {
    clients.forEach((client) => {
      if (client[1] !== socket) {
        client[1].write(
          JSON.stringify(client[0].toString() + ": " + message.toString()),
        );
      }
    });
  });
  socket.on("end", () => {
    console.log("Client disconnected");
  });
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});
/**
 * This function wait for a connection from a client.
 */
server.listen(60300, () => {
  console.log("Server listening on port 60300");
});
