import fs from "fs";
import path from "path";
import { Funko } from "../funko/funko.js";

/**
 * Class to manage the files of the funkos
 */
export class FileManager {
  /**
   * Path to the user's folder
   */
  private userPath: string;
  /**
   * Constructor of the FileManager
   * @param user - User's name
   */
  constructor(private user: string) {
    this.userPath = path.join("users", user);
    fs.mkdir(this.userPath, { recursive: true }, (err) => {
      if (err) console.error("Error creating user folder:", err);
    });
  }
  /**
   * Saves a funko in a file
   * @param funko - Funko to save
   * @param callback - Callback function to handle success or failure
   */
  saveFunko(funko: Funko, callback: (success: boolean) => void): void {
    const filePath = path.join(this.userPath, `${funko.ID}.json`);
    fs.writeFile(filePath, JSON.stringify(funko, null, 2), (err) => {
      if (err) callback(false);
      else callback(true);
    });
  }
  /**
   * Gets a funko from a file
   * @param id - Funko's ID
   * @param callback - Callback function to return the funko or null
   */
  getFunko(id: string, callback: (funko: Funko | null) => void): void {
    const filePath = path.join(this.userPath, `${id}.json`);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) callback(null);
      else callback(JSON.parse(data));
    });
  }
  /**
   * Gets all the funkos of the user
   * @param callback - Callback function to return the array of funkos
   */
  getAllFunkos(callback: (funkos: Funko[]) => void): void {
    fs.readdir(this.userPath, (err, files) => {
      if (err) {
        callback([]);
        return;
      }
      const funkos: Funko[] = [];
      let pending = files.length;
      if (pending === 0) callback(funkos);
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          fs.readFile(path.join(this.userPath, file), "utf-8", (err, data) => {
            if (!err) {
              funkos.push(JSON.parse(data));
            }
            if (--pending === 0) callback(funkos);
          });
        } else {
          if (--pending === 0) callback(funkos);
        }
      });
    });
  }
  /**
   * Deletes a funko
   * @param id - Funko's ID
   * @param callback - Callback function to indicate success or failure
   */
  deleteFunko(id: string, callback: (success: boolean) => void): void {
    const filePath = path.join(this.userPath, `${id}.json`);
    fs.unlink(filePath, (err) => {
      if (err) callback(false);
      else callback(true);
    });
  }
  /**
   * Checks if a funko exists
   * @param id - Funko's ID
   * @param callback - Callback function to return true if exists, false otherwise
   */
  exists(id: string, callback: (exists: boolean) => void): void {
    const filePath = path.join(this.userPath, `${id}.json`);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) callback(false);
      else callback(true);
    });
  }
}
