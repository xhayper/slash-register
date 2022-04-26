<div align="center">
  <br/>
    <h3>slash-register</h3>
  <br/>
  <p>
    <a href="https://www.npmjs.com/package/slash-register"><img src="https://img.shields.io/npm/v/slash-register.svg?maxAge=3600" alt="npm version"/></a>
    <a href="https://www.npmjs.com/package/slash-register"><img src="https://img.shields.io/npm/dt/slash-register.svg?maxAge=3600" alt="npm downloads"/></a>
    <a href="https://github.com/xhayper/slash-register/actions/workflows/CI.yaml"><img src="https://github.com/xhayper/slash-register/actions/workflows/CI.yaml/badge.svg" alt="CI"/></a>
  </p>
</div>

## About

slash-register is a module that manage your slash-command, But instead of "deleting" and "re-registering" everytime, the module will only "POST", "DELETE" and "UPDATE" when it's needed, lowering the bandwith down.

## Installation

**Node.js 16.9.0 or newer is required.**

```sh
npm install slash-register @discordjs/builders
yarn add slash-register @discordjs/builders
pnpm add slash-register @discordjs/builders
```

## Example usage

### Javascript

```js
const { SlashCommandBuilder } = require("@discordjs/builders");
const { SlashRegister } = require("slash-register");

const slashRegister = new SlashRegister();

(async () => {
  console.log("Starting...");

  await slashRegister.login("YOUR TOKEN");

  [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName("server")
      .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
      .setName("user")
      .setDescription("Replies with user info!"),
  ].forEach((builder) => slashRegister.addCommand(builder.toJSON()));

  console.log("Commands registered! Syncing...");

  await slashRegister.sync();
})();
```

### Typescript

```ts
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashRegister } from "slash-create";

const slashRegister = new SlashRegister();

(async () => {
  console.log("Starting...");

  await slashRegister.login("YOUR TOKEN");

  [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName("server")
      .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
      .setName("user")
      .setDescription("Replies with user info!"),
    // @ts-expect-error
  ].forEach((builder) => slashRegister.addCommand(builder.toJSON()));

  console.log("Commands registered! Syncing...");

  await slashRegister.sync();
})();
```

### Javascript with DiscordJS

```js
const { SlashCommandBuilder } = require("@discordjs/builders"),
  { SlashRegister } = require("slash-register"),
  { Client, Intents } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", async () => {
  const slashRegister = new SlashRegister(client);
  slashRegister.login();

  [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName("server")
      .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
      .setName("user")
      .setDescription("Replies with user info!"),
  ].forEach((builder) => slashRegister.addCommand(builder.toJSON()));

  console.log("Commands registered! Syncing...");

  await slashRegister.sync();
});

client.login("YOUR TOKEN");
```

### Typescript with DiscordJS

```js
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashRegister } from "slash-register";
import { Client, Intents } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", async () => {
  const slashRegister = new SlashRegister(client);
  slashRegister.login();

  [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName("server")
      .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
      .setName("user")
      .setDescription("Replies with user info!"),
    // @ts-expect-error
  ].forEach((builder) => slashRegister.addCommand(builder.toJSON()));

  console.log("Commands registered! Syncing...");

  await slashRegister.sync();
});

client.login("YOUR TOKEN");
```

## Links

- [npm](https://www.npmjs.com/package/slash-register.js)

## Note

- This README are yoinked from [discord.js](https://github.com/discordjs/discord.js).
