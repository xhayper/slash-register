import { APIApplicationCommandOptionBase, EqualUtility } from "./equalUtility";
import { SlashCommandBuilder } from "@discordjs/builders";
import Collection from "@discordjs/collection";
import type { Client } from "discord.js";
import { REST } from "@discordjs/rest";
import {
  APIApplicationCommand,
  APIGuild,
  APIUser,
  Routes,
} from "discord-api-types/v10";

export class SlashRegister {
  guildCommandList: Collection<string, SlashCommandBuilder[]> =
    new Collection();
  commandList: SlashCommandBuilder[] = [];
  userId: string | undefined;
  token: string | undefined;

  #rest: REST;

  constructor(client: Client);
  constructor(token: string);
  constructor(...args: [Client | string]) {
    if (typeof args[0] == "string") {
      this.token = args[0];
    } else {
      const client = args[0];
      this.token = client.token!;
      this.userId = client.user!.id;
    }

    this.#rest = new REST({ version: "10" }).setToken(this.token);
  }

  async login() {
    if (this.userId) return;
    const user = (await this.#rest.get(Routes.user())) as APIUser;
    this.userId = user.id;
  }

  async addCommand(command: SlashCommandBuilder) {
    this.commandList.push(command);
  }

  async addGuildCommand(
    command: SlashCommandBuilder,
    guild: string | string[]
  ) {
    if (Array.isArray(guild)) {
      guild.forEach((guild) => this.addGuildCommand(command, guild));
      return;
    }

    const currentGuildCommand = this.guildCommandList.get(guild) || [];
    currentGuildCommand.push(command);
    this.guildCommandList.set(guild, currentGuildCommand);
  }

  getFormattedList(
    oldCommandList: APIApplicationCommand[],
    newCommandList: APIApplicationCommandOptionBase<any>[]
  ): {
    updateList: Collection<string, APIApplicationCommandOptionBase<any>>;
    createList: APIApplicationCommandOptionBase<any>[];
    deleteList: string[];
  } {
    const updateList = new Collection<
      string,
      APIApplicationCommandOptionBase<any>
    >();
    const createList: APIApplicationCommandOptionBase<any>[] = [];
    const deleteList: string[] = [];

    for (const command of newCommandList) {
      const cmd = oldCommandList.find((c) => c.name === command.name);
      if (cmd && !EqualUtility.isCommandEqual(command, cmd)) {
        updateList.set(cmd.id, command);
      } else if (!cmd) {
        createList.push(command);
      }
    }

    for (const command of oldCommandList) {
      if (!this.commandList.find((c) => c.name === command.name)) {
        deleteList.push(command.id);
      }
    }

    return {
      updateList,
      createList,
      deleteList,
    };
  }

  async sync() {
    if (!this.userId) throw new Error("Not logged in");

    const currentCommandList = (await this.#rest.get(
      Routes.applicationCommands(this.userId)
    )) as APIApplicationCommand[];

    const guildList: APIGuild[] | undefined =
      (this.guildCommandList.size > 0 &&
        ((await this.#rest.get(Routes.userGuilds())) as APIGuild[])) ||
      undefined;

    const { updateList, createList, deleteList } = this.getFormattedList(
      currentCommandList,
      this.commandList.map(
        (builder) => builder.toJSON() as APIApplicationCommandOptionBase<any>
      )
    );

    const updatePromises: Promise<any>[] = [];
    const createPromises: Promise<any> = this.#rest.put(
      Routes.applicationCommands(this.userId),
      {
        body: createList,
      }
    );
    const deletePromises: Promise<any>[] = [];

    for (const [id, command] of updateList) {
      updatePromises.push(
        this.#rest.patch(Routes.applicationCommand(this.userId, id), {
          body: command,
        })
      );
    }

    for (const id of deleteList) {
      deletePromises.push(
        this.#rest.delete(Routes.applicationCommand(this.userId, id))
      );
    }

    await Promise.all([...updatePromises, createPromises, ...deletePromises]);
  }
}

export * from "./equalUtility";
