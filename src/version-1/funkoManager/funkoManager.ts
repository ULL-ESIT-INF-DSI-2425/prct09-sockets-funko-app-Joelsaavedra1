import { Funko } from "../funko/funko.js";
import { FileManager } from "../fileManager/fileManager.js";
import chalk, { ChalkInstance } from "chalk";

/**
 * Class that realizes the functions to manage a Funko Pop collection.
 */
export class FunkoManager {
  /**
   * FileManager instance to manage the file system.
   */
  private fileManager: FileManager;

  /**
   * Constructor of the class.
   * @param user - The user that owns the collection.
   */
  constructor(private user: string) {
    this.fileManager = new FileManager(user.toLowerCase());
  }
  /**
   * This method formats a Funko Pop to be displayed.
   * @param funko - The Funko Pop to be formatted.
   * @returns A string with the formatted Funko Pop.
   */
  private formatFunkoOutput(funko: Funko): string {
    let marketColor: ChalkInstance;
    if (funko.market_value < 50) marketColor = chalk.red;
    else if (funko.market_value < 100) marketColor = chalk.magenta;
    else if (funko.market_value < 200) marketColor = chalk.yellow;
    else marketColor = chalk.green;
    return (
      chalk.green(
        `ID: ${funko.ID}\nName: ${funko.name}\nDescription: ${funko.description}\nType: ${funko.type}\nGenre: ${funko.genre}\nFranchise: ${funko.franchise}\nNumber in Franchise: ${funko.num_franchise}\nExclusive: ${funko.exclusive}\nSpecial Specs: ${funko.special_specs}\n`,
      ) +
      marketColor(`Market Value: ${funko.market_value}\n`) +
      chalk.green("------------------------------------------------\n")
    );
  }
  /**
   * This method adds a new Funko Pop to the collection.
   * @param funko - The Funko Pop to be added to the collection.
   * @param callback - The callback function to return the result of the operation.
   */
  addFunko(funko: Funko, callback: (message: string) => void): void {
    this.fileManager.exists(funko.ID, (exists) => {
      if (exists) {
        callback(chalk.red(`Funko already exists in ${this.user} collection!`));
      } else {
        this.fileManager.saveFunko(funko, (success) => {
          if (success) {
            callback(
              chalk.green(`New Funko added to ${this.user} collection!`),
            );
          } else {
            callback(
              chalk.red(`Error adding Funko to ${this.user} collection!`),
            );
          }
        });
      }
    });
  }
  /**
   * This method updates a Funko Pop in the collection.
   * @param funko - The Funko Pop to be updated in the collection.
   * @param callback - The callback function to return the result of the operation.
   */
  updateFunko(funko: Funko, callback: (message: string) => void): void {
    this.fileManager.exists(funko.ID, (exists) => {
      if (exists) {
        this.fileManager.saveFunko(funko, (success) => {
          if (success) {
            callback(chalk.green(`Funko updated at ${this.user} collection!`));
          } else {
            callback(
              chalk.red(`Error updating Funko at ${this.user} collection!`),
            );
          }
        });
      } else {
        callback(chalk.red(`Funko not found at ${this.user} collection!`));
      }
    });
  }
  /**
   * This method removes a Funko Pop from the collection.
   * @param id - The ID of the Funko Pop to be removed from the collection.
   * @param callback - The callback function to return the result of the operation.
   */
  removeFunko(id: string, callback: (message: string) => void): void {
    this.fileManager.deleteFunko(id, (success) => {
      let output = success
        ? chalk.green(`Funko removed from ${this.user} collection!`)
        : chalk.red(`Funko not found at ${this.user} collection!`);

      callback(output);
    });
  }
  /**
   * This method lists all Funko Pops in the collection
   * @param callback - The callback function to return the list of Funkos.
   */
  listFunkos(callback: (message: string) => void): void {
    this.fileManager.getAllFunkos((funkos) => {
      let output = "";
      if (funkos.length === 0) {
        output = chalk.red(`No Funko Pops found in ${this.user} collection!`);
      } else {
        output =
          chalk.green(
            `${this.user} Funko Pop Collection\n------------------------------------------------\n`,
          ) + funkos.map((funko) => this.formatFunkoOutput(funko)).join("");
      }
      callback(output);
    });
  }
  /**
   * This method shows the details of a Funko Pop in the collection.
   * @param id - The ID of the Funko Pop to be shown.
   * @param callback - The callback function to return the details of the Funko Pop.
   */
  showFunko(id: string, callback: (message: string) => void): void {
    this.fileManager.exists(id, (exists) => {
      if (!exists) {
        callback(chalk.red(`Funko not found in ${this.user} collection!`));
        return;
      }
      this.fileManager.getFunko(id, (funko) => {
        if (!funko) {
          callback(chalk.red(`Funko not found in ${this.user} collection!`));
        } else {
          const output =
            chalk.green(
              `${this.user} Funko with ID ${id}\n------------------------------------------------\n`,
            ) + this.formatFunkoOutput(funko);
          callback(output);
        }
      });
    });
  }
}
