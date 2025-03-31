import net from "net";

/**
 * This function connect the client to the server
 * @param port - The port to connect to
 */
const client = net.createConnection({ port: 60300 }, () => {
  console.log("Connected to server");
});

/**
 * This function wait for an user input and send it to the server
 */
process.stdin.on("data", (data) => {
  client.write(JSON.stringify(data.toString()));
});

/**
 * Show the data received from the server
 */
client.on("data", (data) => {
  console.log(JSON.parse(data.toString()));
});

/**
 * This function end the session when the server decides to do so
 */
client.on("end", () => {
  console.log("Disconnected from server");
});
