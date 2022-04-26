import Collection from "@discordjs/collection";
import type { Client } from "discord.js";
import { REST } from "@discordjs/rest";
import {
  APIApplicationCommand,
  APIGuild,
  APIUser,
  Routes,
} from "discord-api-types/v9";
import {
  APIApplicationCommandBase,
  APIApplicationCommandOptionBase,
  EqualUtility,
} from "./equalUtility";

export class SlashRegister {
  guildCommandList: Collection<string, APIApplicationCommandBase[]> =
    new Collection();
  commandList: APIApplicationCommandBase[] = [];
  token: string | undefined;

  #rest: REST | undefined;

  constructor(arg?: Client | string) {
    if (!arg) {
      this.token = process.env.DISCORD_TOKEN;
    } else if (typeof arg == "string") {
      this.token = arg;
    } else {
      const client = arg;
      this.token = client.token!;
    }
  }

  login(token?: string) {
    this.token = token || this.token;
    this.#rest = new REST({ version: "9" }).setToken(this.token!);
  }

  async getUserId(): Promise<string | undefined> {
    if (!this.#rest) return;
    const user = (await this.#rest.get(Routes.user())) as APIUser;
    return user.id;
  }

  async addCommand(command: APIApplicationCommandBase) {
    this.commandList.push(command);
  }

  async addGuildCommand(
    command: APIApplicationCommandBase,
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
    if (!this.#rest) throw new Error("Not logged in");

    const userId = await this.getUserId();
    if (!userId) throw new Error("Invalid token");

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
          Routes.applicationGuildCommands(userId, guildId)
        )) as APIApplicationCommand[];

        const { updateList, createList, deleteList } = this.#getDiff(
          guildCommand,
          this.guildCommandList.get(guildId) || []
        );

        let createPromise: Promise<any> | undefined;

        if (createList.length > 0)
          createPromise = this.#rest.put(
            Routes.applicationGuildCommands(userId, guildId),
            {
              body: createList,
            }
          );

        const updatePromises: Promise<any>[] = [];
        const deletePromises: Promise<any>[] = [];

        for (const [id, command] of updateList) {
          updatePromises.push(
            this.#rest.patch(
              Routes.applicationGuildCommand(userId, guildId, id),
              {
                body: command,
              }
            )
          );
        }

        for (const id of deleteList) {
          deletePromises.push(
            this.#rest.delete(
              Routes.applicationGuildCommand(userId, guildId, id)
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
    if (!this.#rest) throw new Error("Not logged in");

    const userId = await this.getUserId();
    if (!userId) throw new Error("Invalid token");

    const currentCommandList = (await this.#rest.get(
      Routes.applicationCommands(userId)
    )) as APIApplicationCommand[];

    const { updateList, createList, deleteList } = this.#getDiff(
      currentCommandList,
      this.commandList
    );

    let createPromise: Promise<any> | undefined;

    if (createList.length > 0)
      createPromise = this.#rest.put(Routes.applicationCommands(userId), {
        body: createList,
      });

    const updatePromises: Promise<any>[] = [];
    const deletePromises: Promise<any>[] = [];

    for (const [id, command] of updateList) {
      updatePromises.push(
        this.#rest.patch(Routes.applicationCommand(userId, id), {
          body: command,
        })
      );
    }

    for (const id of deleteList) {
      deletePromises.push(
        this.#rest.delete(Routes.applicationCommand(userId, id))
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
