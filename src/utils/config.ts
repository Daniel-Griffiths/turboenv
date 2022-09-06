import { readFileSync } from "node:fs";
import { IConfig } from "src/interfaces/IConfig";

/**
 * Returns the config object from the turboenv.json file.
 */
export function getConfig(): IConfig {
  return JSON.parse(readFileSync("./turboenv.json", "utf8"));
}
