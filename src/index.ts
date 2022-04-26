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
} from "discord-api-types/v9";

export class SlashRegister {
  guildCommandList: Collection<string, SlashCommandBuilder[]> =
    new Collection();
  commandList: SlashCommandBuilder[] = [];
  userId: string | undefined;
  token: string | undefined;

  #rest: REST | undefined;

  constructor(client: Client);
  constructor(token: string);
  constructor(...args: [Client | string | undefined]) {
    if (!args[0]) {
      this.token = process.env.DISCORD_TOKEN;
    } else if (typeof args[0] == "string") {
      this.token = args[0];
    } else {
      const client = args[0];
      this.token = client.token!;
      this.userId = client.user!.id;
    }

    if (this.token)
      this.#rest = new REST({ version: "9" }).setToken(this.token);
  }

  async login() {
    if (!this.#rest)
      this.#rest = new REST({ version: "9" }).setToken(this.token!);
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

  #getDiff(
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

  async syncGuild() {
    if (!this.userId || !this.#rest) throw new Error("Not logged in");

    const guildList: APIGuild[] | undefined =
      (this.guildCommandList.size > 0 &&
        ((await this.#rest.get(Routes.userGuilds())) as APIGuild[])) ||
      undefined;

    if (guildList) {
      const guildIdList = [
        ...new Set([
          ...guildList.map((guild) => guild.id),
          ...Object.keys(this.guildCommandList),
        ]),
      ];
      for (const guildId of guildIdList) {
        const guildCommand = (await this.#rest.get(
          Routes.applicationGuildCommands(this.userId, guildId)
        )) as APIApplicationCommand[];

        const { updateList, createList, deleteList } = this.#getDiff(
          guildCommand,
          (this.guildCommandList.get(guildId) || []).map(
            (builder) =>
              builder.toJSON() as APIApplicationCommandOptionBase<any>
          )
        );

        let createPromise: Promise<any> | undefined;

        if (createList.length > 0)
          createPromise = this.#rest.put(
            Routes.applicationGuildCommands(this.userId, guildId),
            {
              body: createList,
            }
          );

        const updatePromises: Promise<any>[] = [];
        const deletePromises: Promise<any>[] = [];

        for (const [id, command] of updateList) {
          updatePromises.push(
            this.#rest.patch(
              Routes.applicationGuildCommand(this.userId, guildId, id),
              {
                body: command,
              }
            )
          );
        }

        for (const id of deleteList) {
          deletePromises.push(
            this.#rest.delete(
              Routes.applicationGuildCommand(this.userId, guildId, id)
            )
          );
        }

        await Promise.all([
          ...updatePromises,
          createPromise,
          ...deletePromises,
        ]);
      }
    }
  }

  async sync() {
    if (!this.userId || !this.#rest) throw new Error("Not logged in");

    const currentCommandList = (await this.#rest.get(
      Routes.applicationCommands(this.userId)
    )) as APIApplicationCommand[];

    const { updateList, createList, deleteList } = this.#getDiff(
      currentCommandList,
      this.commandList.map(
        (builder) => builder.toJSON() as APIApplicationCommandOptionBase<any>
      )
    );

    let createPromise: Promise<any> | undefined;

    if (createList.length > 0)
      createPromise = this.#rest.put(Routes.applicationCommands(this.userId), {
        body: createList,
      });

    const updatePromises: Promise<any>[] = [];
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

    await Promise.all([...updatePromises, createPromise, ...deletePromises]);
  }

  async syncAll() {
    await this.sync();
    await this.syncGuild();
  }
}

export * from "./equalUtility";
