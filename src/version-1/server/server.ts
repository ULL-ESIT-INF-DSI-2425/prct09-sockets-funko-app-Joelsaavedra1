import net from "net";
import { FunkoManager } from "../funkoManager/funkoManager.js";
import { RequestType, ResponseType } from "../types/types.js";

/**
 * This function creates a server that listens for incoming connections on port 60300.
 * Also handles incoming requests from clients and processes them using the FunkoManager class.
 * It handles requests to add, remove, update, show, and list Funkos.
 * The server responds to the client with the result of the operation.
 */
const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  console.log("Client connected");
  
  let dataBuffer = "";
  socket.on("data", (data) => {
    dataBuffer += data.toString();
    const request: RequestType = JSON.parse(dataBuffer);
    console.log("Request received:", request);
    const manager: FunkoManager = new FunkoManager(request.user.toLowerCase());
    let response: ResponseType;
    switch (request.type) {
      case "add":
        console.log("Handling 'add' request");
        if (request.funko) {
          manager.addFunko(request.funko, (message) => {
            response = {
              type: "add",
              success: true,
              message,
            };
            socket.write(JSON.stringify(response), () => {
              socket.end();
            });
          });
        }
        break;
      case "remove":
        console.log("Handling 'remove' request");
        if (request.id) {
          manager.removeFunko(request.id, (message) => {
            response = {
              type: "remove",
              success: true,
              message,
            };
            socket.write(JSON.stringify(response), () => {
              socket.end();
            });
          });
        }
        break;
      case "update":
        console.log("Handling 'update' request");
        if (request.funko) {
          manager.updateFunko(request.funko, (message) => {
            response = {
              type: "update",
              success: true,
              message,
            };
            socket.write(JSON.stringify(response), () => {
              socket.end();
            });
          });
        }
        break;
      case "show":
        console.log("Handling 'show' request");
        if (request.id) {
          manager.showFunko(request.id, (message) => {
            response = {
              type: "show",
              success: true,
              message,
            };
            socket.write(JSON.stringify(response), () => {
              socket.end();
            });
          });
        }
        break;
      case "list":
        console.log("Handling 'list' request");
        manager.listFunkos((message) => {
          response = {
            type: "list",
            success: true,
            message,
          };
          socket.write(JSON.stringify(response), () => {
            socket.end();
          });
        });
        break;
      default:
        response = {
          type: "error",
          success: false,
          message: "Invalid request type",
        };
        socket.write(JSON.stringify(response), () => {
          socket.end();
        });
        break;
    }
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
