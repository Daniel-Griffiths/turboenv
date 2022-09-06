#!/usr/bin/env node
import { logRainbow } from "src/utils/log";
import { getConfig } from "src/utils/config";
import { validateExampleEnv, validateEnvs } from "src/utils/env";

const config = getConfig();

validateExampleEnv(config);

await validateEnvs(config);

logRainbow(`All .env files are valid!`);
