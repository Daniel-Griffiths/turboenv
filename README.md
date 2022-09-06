<img src="logo.svg" width="100%" alt="Turborepo">

> **Warning**
> This project is a work in progress and should not be used in production

Turboenv is .env schema validation library that help keeps your team on the same page.

Some of the features include:

- Automatically creating the `.env` file if it doesnt exist.
- Validating `.env` values against a schema to ensure they are correct
- A CLI wizard that will help devs add new values to thier `.env` if the example example `.env` has since changed.

![Tests](https://github.com/Daniel-Griffiths/turboenv/actions/workflows/publish.yml/badge.svg)

## Install globally

```bash
npm install -g turboenv
# Or Yarn
yarn global add turboenv
```

## Install as a package

```bash
npm install turboenv
# Or Yarn
yarn add turboenv
```

Then add the following command to your package.json file:

```json
{
  "scripts": {
    "turboenv": "turboenv"
  }
}
```

Optionally you can run it in your projects start command to ensure the env file is valid at startup.

```json
{
  "prestart": "turboenv",
  "start": "next dev"
}
```

## Usage

Create a `turboenv.json` file in the root of your project. See the example config file below:

```json
{
  "envPaths": [".env"],
  "envExamplePath": ".env.example",
  "schema": {
    "NODE_ENV": {
      "type": "string",
      "required": true
    },
    "API_URL": {
      "type": "url",
      "required": true
    },
    "TEST": {
      "type": "url",
      "required": true
    }
  }
}
```
