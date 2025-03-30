import net from "net";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FunkoType, FunkoGenre } from "../funko/funko.js";
import { RequestType } from "../types/types.js";

/**
 * This function validates the type and genre of a Funko
 * @param type - The type of the Funko
 * @param genre - The genre of the Funko
 */
const validateFunkoAttributes = (type, genre) => {
  if (!Object.values(FunkoType).includes(type))
    throw new Error("Invalid Funko type");
  if (!Object.values(FunkoGenre).includes(genre))
    throw new Error("Invalid Funko genre");
};

/**
 * This function creates a Funko object from the arguments
 * @param args - The arguments to create a Funko from
 * @returns A Funko object created from the arguments
 */
const createFunkoFromArgs = (args) => {
  validateFunkoAttributes(args.type, args.genre);
  return {
    ID: args.id,
    name: args.name,
    description: args.description,
    type: args.type,
    genre: args.genre,
    franchise: args.franchise,
    num_franchise: args.num_franchise,
    exclusive: args.exclusive,
    special_specs: args.specialFeatures,
    market_value: args.market_value,
  };
};

/**
 * This function receives a Funko method and atributes from the command line
 */
const argv = yargs(hideBin(process.argv))
  .command("add", "Add a new Funko", {
    user: { type: "string", demandOption: true },
    id: { type: "string", demandOption: true },
    name: { type: "string", demandOption: true },
    description: { type: "string", demandOption: true },
    type: { type: "string", demandOption: true },
    genre: { type: "string", demandOption: true },
    franchise: { type: "string", demandOption: true },
    num_franchise: { type: "number", demandOption: true },
    exclusive: { type: "boolean", demandOption: true },
    specialFeatures: { type: "string", demandOption: true },
    market_value: { type: "number", demandOption: true },
  })
  .command("remove", "Remove a Funko", {
    user: { type: "string", demandOption: true },
    id: { type: "string", demandOption: true },
  })
  .command("update", "Update a Funko info", {
    user: { type: "string", demandOption: true },
    id: { type: "string", demandOption: true },
    name: { type: "string", demandOption: true },
    description: { type: "string", demandOption: true },
    type: { type: "string", demandOption: true },
    genre: { type: "string", demandOption: true },
    franchise: { type: "string", demandOption: true },
    num_franchise: { type: "number", demandOption: true },
    exclusive: { type: "boolean", demandOption: true },
    specialFeatures: { type: "string", demandOption: true },
    market_value: { type: "number", demandOption: true },
  })
  .command("show", "Show a Funko", {
    user: { type: "string", demandOption: true },
    id: { type: "string", demandOption: true },
  })
  .command("list", "List all Funkos", {
    user: { type: "string", demandOption: true },
  })
  .help().argv;

/**
 * This function connect the client to the server and sends the request
 * @param port - The port to connect to
 */
const client = net.createConnection({ port: 60300 }, () => {
  console.log("Connected to server");
  let request: RequestType;
  if (argv._[0] === "add") {
    request = {
      type: "add",
      user: argv.user,
      funko: createFunkoFromArgs(argv),
    };
  } else if (argv._[0] === "remove") {
    request = {
      type: "remove",
      user: argv.user,
      id: argv.id,
    };
  } else if (argv._[0] === "update") {
    request = {
      type: "update",
      user: argv.user,
      funko: createFunkoFromArgs(argv),
    };
  } else if (argv._[0] === "show") {
    request = {
      type: "show",
      user: argv.user,
      id: argv.id,
    };
  } else if (argv._[0] === "list") {
    request = {
      type: "list",
      user: argv.user,
    };
  } else {
    console.error("Unknown command");
    client.end();
    return;
  }
  client.write(JSON.stringify(request));
  client.end();
});

/**
 * This function handles the data received from the server
 * @param data - The data received from the server
 */
client.on("data", (data) => {
  const response = JSON.parse(data.toString());
  if (response.success) {
    console.log(response.message);
  } else {
    console.error(response.message);
  }
});

/**
 * This function handles the error received from the server
 * @param error - The error received from the server
 */
client.on("end", () => {
  console.log("Disconnected from server");
});
