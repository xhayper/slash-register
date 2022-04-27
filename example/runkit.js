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
