import { APIApplicationCommand, APIGuild, APIUser, Routes } from 'discord-api-types/v9';
import { APIApplicationCommandBase, EqualUtility } from './equalUtility';
import Collection from '@discordjs/collection';
import { REST } from '@discordjs/rest';

export class SlashRegister {
  guildCommandList: Collection<string, APIApplicationCommandBase[]> = new Collection();
  globalCommandList: APIApplicationCommandBase[] = [];

  token: string | undefined;
  #rest: REST | undefined;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  login(token?: string) {
    this.token = token || process.env.DISCORD_TOKEN;
    if (!this.token) throw new Error('Invalid token');
    this.#rest = new REST({ version: '9' }).setToken(this.token);
  }

  #getDiff(
    oldCommandList: APIApplicationCommand[],
    newCommandList: APIApplicationCommandBase[]
  ): {
    updateList: Collection<string, APIApplicationCommandBase>;
    createList: APIApplicationCommandBase[];
    deleteList: string[];
  } {
    const updateList = new Collection<string, APIApplicationCommandBase>();
    const createList: APIApplicationCommandBase[] = [];
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
      if (!this.globalCommandList.find((c) => c.name === command.name)) {
        deleteList.push(command.id);
      }
    }

    return {
      updateList,
      createList,
      deleteList
    };
  }

  async getUser(): Promise<APIUser | undefined> {
    if (!this.#rest) return;
    const user = (await this.#rest.get(Routes.user())) as APIUser;
    return user;
  }

  async removeAllGlobalCommand() {
    this.globalCommandList = [];
  }

  async removeAlLGuildCommand() {
    this.guildCommandList = new Collection();
  }

  async addGlobalCommand(command: APIApplicationCommandBase | APIApplicationCommandBase[]) {
    const currentGlobalCommandList = this.globalCommandList;
    if (Array.isArray(command)) {
      this.globalCommandList = [...currentGlobalCommandList, ...command];
    } else {
      this.globalCommandList = [...currentGlobalCommandList, command];
    }
  }

  async addGuildCommand(guild: string | string[], command: APIApplicationCommandBase | APIApplicationCommandBase[]) {
    if (Array.isArray(guild)) {
      guild.forEach((g) => this.addGuildCommand(g, command));
      return;
    }

    const currentGuildCommand = this.guildCommandList.get(guild) || [];

    if (Array.isArray(command)) {
      this.guildCommandList.set(guild, [...currentGuildCommand, ...command]);
    } else {
      this.guildCommandList.set(guild, [...currentGuildCommand, command]);
    }
  }

  async syncGuild() {
    if (!this.#rest) throw new Error('Not logged in');

    const user = await this.getUser();
    if (!user) throw new Error('Invalid token');

    const guildList: APIGuild[] | undefined =
      (this.guildCommandList.size > 0 && ((await this.#rest.get(Routes.userGuilds())) as APIGuild[])) || undefined;

    if (guildList) {
      const guildIdList = [...new Set([...guildList.map((guild) => guild.id), ...Object.keys(this.guildCommandList)])];
      for (const guildId of guildIdList) {
        const guildCommand = (await this.#rest.get(
          Routes.applicationGuildCommands(user.id, guildId)
        )) as APIApplicationCommand[];

        const { updateList, createList, deleteList } = this.#getDiff(
          guildCommand,
          this.guildCommandList.get(guildId) || []
        );

        let createPromise: Promise<any> | undefined;

        if (createList.length > 0)
          createPromise = this.#rest.put(Routes.applicationGuildCommands(user.id, guildId), {
            body: createList
          });

        const updatePromises: Promise<any>[] = [];
        const deletePromises: Promise<any>[] = [];

        for (const [id, command] of updateList) {
          updatePromises.push(
            this.#rest.patch(Routes.applicationGuildCommand(user.id, guildId, id), {
              body: command
            })
          );
        }

        for (const id of deleteList) {
          deletePromises.push(this.#rest.delete(Routes.applicationGuildCommand(user.id, guildId, id)));
        }

        await Promise.all([...updatePromises, createPromise, ...deletePromises]);
      }
    }
  }

  async sync() {
    if (!this.#rest) throw new Error('Not logged in');

    const user = await this.getUser();
    if (!user) throw new Error('Invalid token');

    const currentCommandList = (await this.#rest.get(Routes.applicationCommands(user.id))) as APIApplicationCommand[];

    const { updateList, createList, deleteList } = this.#getDiff(currentCommandList, this.globalCommandList);

    let createPromise: Promise<any> | undefined;

    if (createList.length > 0)
      createPromise = this.#rest.put(Routes.applicationCommands(user.id), {
        body: createList
      });

    const updatePromises: Promise<any>[] = [];
    const deletePromises: Promise<any>[] = [];

    for (const [id, command] of updateList) {
      updatePromises.push(
        this.#rest.patch(Routes.applicationCommand(user.id, id), {
          body: command
        })
      );
    }

    for (const id of deleteList) {
      deletePromises.push(this.#rest.delete(Routes.applicationCommand(user.id, id)));
    }

    await Promise.all([...updatePromises, createPromise, ...deletePromises]);
  }

  async syncAll() {
    await this.sync();
    await this.syncGuild();
  }

  async unsync() {
    if (!this.#rest) throw new Error('Not logged in');

    const user = await this.getUser();
    if (!user) throw new Error('Invalid token');

    const guildList = (await this.#rest.get(Routes.userGuilds())) as APIGuild[];

    for (const guild of guildList) {
      const commandList = (await this.#rest.get(
        Routes.applicationGuildCommands(user.id, guild.id)
      )) as APIApplicationCommand[];

      for (const command of commandList) {
        await this.#rest.delete(Routes.applicationGuildCommand(user.id, guild.id, command.id));
      }
    }

    const currentCommandList = (await this.#rest.get(Routes.applicationCommands(user.id))) as APIApplicationCommand[];

    for (const command of currentCommandList) {
      await this.#rest.delete(Routes.applicationCommand(user.id, command.id));
    }
  }
}

export * from './equalUtility';
