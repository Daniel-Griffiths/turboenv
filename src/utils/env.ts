import { input } from "@inquirer/prompts";
import { writeFileSync, readFileSync, existsSync } from "node:fs";

import { logError } from "src/utils/log";
import { IConfig } from "src/interfaces/IConfig";
import { validate, validateValue } from "src/utils/validator";

/**
 * Converts a env format string into a generic object.
 */
export function envToObject(env: string): Record<string, string> {
  return env.split("\n").reduce((accumulator, line) => {
    const [key, value] = line.split("=");

    if (key && !key.trim().startsWith("#")) {
      const valueWithoutWrappingQuotes = value.replace(/(^"|"$)/g, "");
      accumulator[key] = valueWithoutWrappingQuotes;
    }

    return accumulator;
  }, {});
}

/**
 * Takes a generic object and converts it into a env format string.
 */
export function objectToEnv<T extends Object>(object: T): string {
  return Object.entries(object)
    .map(([key, value]) => {
      return `${key}="${value}"`;
    })
    .join("\n");
}

/**
 * Gets the string content of a env file.
 */
export function getEnvFromFile(path: string): Record<string, string> {
  if (!existsSync(path)) {
    writeFileSync(path, "");
  }

  const env = readFileSync(path, "utf8");
  return envToObject(env);
}

export function validateExampleEnv(config: IConfig): void {
  const envExample = getEnvFromFile(config.envExamplePath);
  const errors = validate(config.schema, envExample).filter(
    (result) => !result.isValid
  );

  if (errors.length) {
    logError(`Your "${config.envExamplePath}" file has the following issues:`);
    errors.forEach(({ error }) => logError(`- ${error}`));
    process.exit(1);
  }
}

// TODO : Refactor this
export async function validateEnvs(config: IConfig): Promise<void> {
  const envExample = getEnvFromFile(config.envExamplePath);

  for (const envPath of config.envPaths) {
    const env = getEnvFromFile(envPath);

    for (const [key, value] of Object.entries(envExample)) {
      if (env[key]) continue;
      if (!config.schema[key]) throw new Error(`Unknown key: ${key}`);

      const answer = await input({
        default: value,
        message: `"${key}" is missing from your "${envPath}" please a valid "${config.schema[key].type}":`,
        validate: (answer) => {
          const result = validateValue(config.schema[key], answer);
          return !result.isValid ? result.error : true;
        },
      });

      writeFileSync(envPath, `\n${key}="${answer}"`, {
        flag: "a",
      });
    }
  }
}
