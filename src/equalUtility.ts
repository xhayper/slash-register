import { type APIApplicationCommandOption, type APIApplicationCommand } from 'discord-api-types/v10';
import isEqual from 'fast-deep-equal';

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
      option.required !== existing.required ||
      option.choices?.length !== existing.choices?.length ||
      option.options?.length !== existing.options?.length ||
      option.channel_types?.length !== existing.channel_types?.length ||
      option.min_value !== existing.min_value ||
      option.max_value !== existing.max_value ||
      option.min_length !== existing.min_length ||
      option.max_length !== existing.max_length ||
      !isEqual(option.name_localizations ?? {}, existing.name_localizations ?? {}) ||
      !isEqual(option.description_localizations ?? {}, existing.description_localizations ?? {})
    ) {
      return false;
    }

    if (existing.choices) {
      if (
        enforceOptionOrder &&
        !existing.choices.every(
          (choice: any, index: any) =>
            choice.name === option.choices[index].name &&
            choice.value === option.choices[index].value &&
            isEqual(choice.name_localizations ?? {}, option.choices[index].name_localizations ?? {})
        )
      ) {
        return false;
      }
      if (!enforceOptionOrder) {
        const newChoices = new Map<string, { name: string; value: string }>(
          option.choices.map((choice: any) => [choice.name, choice])
        );
        for (const choice of existing.choices) {
          const foundChoice = newChoices.get(choice.name);
          if (!foundChoice || foundChoice.value !== choice.value) return false;
        }
      }
    }

    if (existing.channel_types) {
      for (const type of existing.channel_types) {
        if (!option.channel_types.includes(type)) return false;
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
  ) {
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

  static isCommandEqual(
    command1: APIApplicationCommand,
    command2: APIApplicationCommand,
    enforceOptionOrder = false
  ): boolean {
    // Check top level parameters
    if (
      command2.name !== command1.name ||
      ('description' in command2 && command2.description !== command1.description) ||
      (command2.type && command2.type !== command1.type) ||
      // Future proof for options being nullable
      // TODO: remove ?? 0 on each when nullable
      (command2.options?.length ?? 0) !== (command1.options?.length ?? 0) ||
      (command2.default_member_permissions ?? null) !== (command1.default_member_permissions ?? null) ||
      command2.dm_permission !== command1.dm_permission ||
      !isEqual(command2.name_localizations ?? {}, command1.name_localizations ?? {}) ||
      !isEqual(command2.description_localizations ?? {}, command1.description_localizations ?? {})
    ) {
      return false;
    }
    if (command2.options) {
      return this.optionsEqual(command1.options as any, command2.options, enforceOptionOrder);
    }
    return true;
  }
}
