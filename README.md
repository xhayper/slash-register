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
const { SlashCommandBuilder } = require('@discordjs/builders'),
  { SlashRegister } = require('slash-register');

const slashRegister = new SlashRegister();

(async () => {
  console.log('Starting...');

  slashRegister.login('YOUR TOKEN');

  [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info!')
  ].forEach((builder) => slashRegister.addGlobalCommand(builder.toJSON()));

  console.log('Commands registered! Syncing...');

  await slashRegister.sync();
})();
```

### Typescript

```ts
import { APIApplicationCommandBase, SlashRegister } from 'slash-register';
import { SlashCommandBuilder } from '@discordjs/builders';

const slashRegister = new SlashRegister();

(async () => {
  console.log('Starting...');

  slashRegister.login('YOUR TOKEN');

  [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info!')
  ].forEach((builder) => slashRegister.addGlobalCommand(builder.toJSON() as APIApplicationCommandBase));

  console.log('Commands registered! Syncing...');

  await slashRegister.sync();
})();
```

## Links

- [npm](https://www.npmjs.com/package/slash-register)

## Note

- This README are yoinked from [discord.js](https://github.com/discordjs/discord.js).
