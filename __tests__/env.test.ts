import { vol, fs } from "memfs";
import { expect, it, vi, afterEach, describe, beforeEach } from "vitest";

import { envToObject, objectToEnv } from "src/utils/env";

const ENV = `API_URL="http://localhost:3000"`;

const ENV_EXAMPLE = `NODE_ENV="DEV"
API_URL="http://localhost:3000"`;

const CONFIG = JSON.stringify({
  envPath: ".env",
  envExamplePath: ".env.example",
  schema: {
    NODE_ENV: {
      type: "url",
      required: true,
    },
  },
});

/**
 * Prevent process.exit calls from killing jest
 */
vi.spyOn(process, "exit").mockImplementation((code): never => {
  return null as never;
});

beforeEach(() => {
  vol.fromNestedJSON({
    ".env": ENV,
    "turboenv.json": CONFIG,
    ".env.example": ENV_EXAMPLE,
  });
});

afterEach(() => {
  vol.reset();
});

describe("env", () => {
  it("can convert a env to a object", async () => {
    const object = envToObject(ENV_EXAMPLE);

    expect(object).toStrictEqual({
      NODE_ENV: "DEV",
      API_URL: "http://localhost:3000",
    });
  });

  it("can convert a object to a env", async () => {
    const object = objectToEnv({
      NODE_ENV: "DEV",
      API_URL: "http://localhost:3000",
    });

    expect(object).toStrictEqual(ENV_EXAMPLE);
  });
});
