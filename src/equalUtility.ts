import isEqual from 'fast-deep-equal';
import {
  type APIApplicationCommandOption,
  type APIApplicationCommand,
  ApplicationCommandOptionType
} from 'discord-api-types/v10';

export class EqualUtility {
  private static _optionEquals(
    existing: Record<string, any>,
    option: Record<string, any>,
    enforceOptionOrder = false
  ): boolean {
    if (
      option.name !== existing.name ||
      option.type !== existing.type ||
      option.description !== existing.description ||
      option.autocomplete !== existing.autocomplete ||
      (option.required ??
        ([ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(option.type)
          ? undefined
          : false)) !== existing.required ||
      (option.choices ?? []).length !== (existing.choices ?? []).length ||
      (option.options ?? []).length !== (existing.options ?? []).length ||
      (option.channelTypes ?? option.channel_types)?.length !== existing.channelTypes?.length ||
      (option.minValue ?? option.min_value) !== existing.minValue ||
      (option.maxValue ?? option.max_value) !== existing.maxValue ||
      (option.minLength ?? option.min_length) !== existing.minLength ||
      (option.maxLength ?? option.max_length) !== existing.maxLength ||
      !isEqual(option.name_localizations ?? {}, existing.nameLocalizations ?? {}) ||
      !isEqual(option.description_localizations ?? {}, existing.descriptionLocalizations ?? {})
    ) {
      return false;
    }

    if (existing.choices) {
      if (
        enforceOptionOrder &&
        !existing.choices.every(
          (choice: any, index: number) =>
            choice.name === option.choices[index].name &&
            choice.value === option.choices[index].value &&
            isEqual(
              choice.nameLocalizations ?? {},
              option.choices[index].nameLocalizations ?? option.choices[index].name_localizations ?? {}
            )
        )
      ) {
        return false;
      }

      if (!enforceOptionOrder) {
        const newChoices = new Map(option.choices.map((choice: any) => [choice.name, choice]));
        for (const choice of existing.choices) {
          const foundChoice = newChoices.get(choice.name) as Record<any, any>;
          if (!foundChoice || foundChoice.value !== choice.value) return false;
        }
      }
    }

    if (existing.channelTypes) {
      const newTypes = option.channelTypes ?? option.channel_types;
      for (const type of existing.channelTypes) {
        if (!newTypes.includes(type)) return false;
      }
    }

    if (existing.options) {
      return this.optionsEqual(existing.options, option.options, enforceOptionOrder);
    }

    return true;
  }

  static optionsEqual(
    existing: APIApplicationCommandOption[],
    options: APIApplicationCommandOption[],
    enforceOptionOrder = false
  ): boolean {
    if (existing.length !== options.length) return false;
    if (enforceOptionOrder) {
      return existing.every((option, index) => this._optionEquals(option, options[index], enforceOptionOrder));
    }
    const newOptions = new Map(options.map((option) => [option.name, option]));
    for (const option of existing) {
      const foundOption = newOptions.get(option.name);
      if (!foundOption || !this._optionEquals(option, foundOption)) return false;
    }
    return true;
  }

  static isCommandEqual(command1: APIApplicationCommand, command2: APIApplicationCommand): boolean {
    let defaultMemberPermissions = null;
    let dmPermission = command2.dm_permission;

    if (command2.default_member_permissions) defaultMemberPermissions = command2.default_member_permissions ?? null;

    // Check top level parameters
    if (
      command2.name !== command1.name ||
      command2.description !== command1.description ||
      (command2.type && command2.type !== command1.type) ||
      // Future proof for options being nullable
      // TODO: remove ?? 0 on each when nullable
      (command2.options?.length ?? 0) !== (command1.options?.length ?? 0) ||
      defaultMemberPermissions !== (command1.default_member_permissions ?? null) ||
      (typeof dmPermission !== 'undefined' && dmPermission !== command1.dm_permission) ||
      !isEqual(command2.name_localizations ?? {}, command1.name_localizations ?? {}) ||
      !isEqual(command2.description_localizations ?? {}, command1.description_localizations ?? {})
    ) {
      return false;
    }

    if (!!command1.options !== !!command2.options) return false;
    if (!!command1.options && !!command2.options) return this.optionsEqual(command1.options, command2.options, true);

    return true;
  }
}
