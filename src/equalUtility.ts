import {
  APIApplicationCommandAttachmentOption,
  APIApplicationCommandBooleanOption,
  APIApplicationCommandChannelOption,
  APIApplicationCommandIntegerOption,
  APIApplicationCommandMentionableOption,
  APIApplicationCommandNumberOption,
  APIApplicationCommandOption,
  APIApplicationCommandOptionChoice,
  APIApplicationCommandRoleOption,
  APIApplicationCommandStringOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandUserOption,
  ApplicationCommandOptionType,
  LocalizationMap,
} from "discord-api-types/v10";

export const Locale = [
  "en-US",
  "en-GB",
  "bg",
  "zh-CN",
  "zh-TW",
  "hr",
  "cs",
  "da",
  "nl",
  "fi",
  "fr",
  "de",
  "el",
  "hi",
  "hu",
  "it",
  "ja",
  "ko",
  "lt",
  "no",
  "pl",
  "pt-BR",
  "ro",
  "ru",
  "es-ES",
  "sv-SE",
  "th",
  "tr",
  "uk",
  "vi",
] as const;

export type APIApplicationCommandOptionBase<
  Type extends ApplicationCommandOptionType
> = {
  readonly type: Type;
  readonly name: string;
  readonly name_localizations?: LocalizationMap | null;
  readonly description: string;
  readonly description_localizations?: LocalizationMap | null;
  readonly required?: boolean;
};

export const EqualUtility = new (class {
  #isNull(a?: any): boolean {
    return !a || a === null || a === undefined;
  }

  #isEqual(a?: any, b?: any): boolean {
    if (!a && !b) return true;
    if (this.#isNull(a) && this.#isNull(b)) return true;
    return a === b;
  }

  isLocalizationEqual(
    a?: LocalizationMap | null,
    b?: LocalizationMap | null
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    for (let locale of Locale) {
      const aValue = a![locale];
      const bValue = b![locale];
      if (!this.#isEqual(aValue, bValue)) return false;
    }
    return true;
  }

  isOptionChoiceEqual(
    a?: APIApplicationCommandOptionChoice,
    b?: APIApplicationCommandOptionChoice
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    return (
      this.#isEqual(a!.name, b!.name) &&
      this.#isEqual(a!.value, b!.value) &&
      this.isLocalizationEqual(a!.name_localizations, b!.name_localizations)
    );
  }

  isArrayOptionChoiceEqual(
    a?: APIApplicationCommandOptionChoice[],
    b?: APIApplicationCommandOptionChoice[]
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (a!.length !== b!.length) return false;
    a = a!.sort();
    b = b!.sort();
    for (let i = 0; i < a.length; i++) {
      if (!this.isOptionChoiceEqual(a[i], b[i])) return false;
    }
    return true;
  }

  isBaseEqual(
    a?: APIApplicationCommandOptionBase<any>,
    b?: APIApplicationCommandOptionBase<any>
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.#isEqual(a!.name, b!.name)) return false;
    if (!this.#isEqual(a!.description, b!.description)) return false;
    if (!this.#isEqual(a!.required, b!.required)) return false;
    if (!this.isLocalizationEqual(a!.name_localizations, b!.name_localizations))
      return false;
    if (
      !this.isLocalizationEqual(
        a!.description_localizations,
        b!.description_localizations
      )
    )
      return false;
    return true;
  }

  isAttachmentOptionEqual(
    a?: APIApplicationCommandAttachmentOption,
    b?: APIApplicationCommandAttachmentOption
  ): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (!this.isBaseEqual(a, b)) return false;
    return true;
  }

  isRoleOptionEqual(
    a?: APIApplicationCommandRoleOption,
    b?: APIApplicationCommandRoleOption
  ): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (!this.isBaseEqual(a, b)) return false;
    return true;
  }

  isUserOptionEqual(
    a?: APIApplicationCommandUserOption,
    b?: APIApplicationCommandUserOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    return true;
  }

  isStringOptionEqual(
    a?: APIApplicationCommandStringOption,
    b?: APIApplicationCommandStringOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    if (a!.autocomplete != b!.autocomplete) return false;
    if (
      !a!.autocomplete &&
      !b!.autocomplete &&
      // @ts-expect-error
      !this.isArrayOptionChoiceEqual(a!.choices, b!.choices)
    )
      return false;
    return true;
  }

  isNumberOptionEqual(
    a?: APIApplicationCommandNumberOption,
    b?: APIApplicationCommandNumberOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    if (a!.min_value != b!.min_value) return false;
    if (a!.max_value != b!.max_value) return false;
    if (a!.autocomplete != b!.autocomplete) return false;
    if (
      !a!.autocomplete &&
      !b!.autocomplete &&
      // @ts-expect-error
      !this.isArrayOptionChoiceEqual(a!.choices, b!.choices)
    )
      return false;
    return true;
  }

  isIntegerOptionEqual(
    a?: APIApplicationCommandIntegerOption,
    b?: APIApplicationCommandIntegerOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    if (a!.min_value != b!.min_value) return false;
    if (a!.max_value != b!.max_value) return false;
    if (a!.autocomplete != b!.autocomplete) return false;
    if (
      !a!.autocomplete &&
      !b!.autocomplete &&
      // @ts-expect-error
      !this.isArrayOptionChoiceEqual(a.choices, b.choices)
    )
      return false;
    return true;
  }

  isBooleanOptionEqual(
    a?: APIApplicationCommandBooleanOption,
    b?: APIApplicationCommandBooleanOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    return true;
  }

  isChannelOptionEqual(
    a?: APIApplicationCommandChannelOption,
    b?: APIApplicationCommandChannelOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    if (!a!.channel_types || !b!.channel_types) return false;
    if (a!.channel_types!.length !== b!.channel_types!.length) return false;
    if (!a!.channel_types.every((value) => b!.channel_types!.includes(value)))
      return false;
    return true;
  }

  isMentionableOptionEqual(
    a?: APIApplicationCommandMentionableOption,
    b?: APIApplicationCommandMentionableOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    return true;
  }

  #equalUsingType(
    a?: APIApplicationCommandOptionBase<any>,
    b?: APIApplicationCommandOptionBase<any>
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (a!.type != b!.type) return false;
    switch (a!.type) {
      case ApplicationCommandOptionType.Subcommand:
        return this.isSubcommandOptionEqual(a, b);
      case ApplicationCommandOptionType.Attachment:
        return this.isAttachmentOptionEqual(a, b);
      case ApplicationCommandOptionType.Role:
        return this.isRoleOptionEqual(a, b);
      case ApplicationCommandOptionType.User:
        return this.isUserOptionEqual(a, b);
      case ApplicationCommandOptionType.String:
        return this.isStringOptionEqual(a, b);
      case ApplicationCommandOptionType.Integer:
        return this.isIntegerOptionEqual(a, b);
      case ApplicationCommandOptionType.Number:
        return this.isNumberOptionEqual(a, b);
      case ApplicationCommandOptionType.Boolean:
        return this.isBooleanOptionEqual(a, b);
      case ApplicationCommandOptionType.Channel:
        return this.isChannelOptionEqual(a, b);
      case ApplicationCommandOptionType.Mentionable:
        return this.isMentionableOptionEqual(a, b);
      default:
        return false;
    }
  }

  isSubcommandGroupOptionEqual(
    a?: APIApplicationCommandSubcommandGroupOption,
    b?: APIApplicationCommandSubcommandGroupOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    if (!a!.options || !b!.options) return false;
    if (a!.options.length != b!.options.length) return false;
    const aOptions = a!.options.sort();
    const bOptions = b!.options.sort();
    for (let i = 0; i < aOptions.length; i++) {
      if (!this.isSubcommandOptionEqual(aOptions[i], bOptions[i])) return false;
    }
    return true;
  }

  isSubcommandOptionEqual(
    a?: APIApplicationCommandSubcommandOption,
    b?: APIApplicationCommandSubcommandOption
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    if (!a!.options && !b!.options) return true;
    if (!a!.options || !b!.options) return false;
    if (a!.options.length != b!.options.length) return false;
    const aOptions = a!.options.sort();
    const bOptions = b!.options.sort();
    for (let i = 0; i < aOptions.length; i++) {
      if (!this.#equalUsingType(aOptions[i], bOptions[i])) return false;
    }
    return true;
  }

  isCommandEqual(
    a?: APIApplicationCommandOptionBase<any> & {
      options?: APIApplicationCommandOption[];
    },
    b?: APIApplicationCommandOptionBase<any> & {
      options?: APIApplicationCommandOption[];
    }
  ): boolean {
    if (this.#isNull(a) && this.#isNull(b)) return true;
    if (this.#isNull(a) || this.#isNull(b)) return false;
    if (!this.isBaseEqual(a, b)) return false;
    if (!a!.options && !b!.options) return true;
    if (!a!.options || !b!.options) return false;
    if (a!.options.length != b!.options.length) return false;
    const aOptions = a!.options.sort();
    const bOptions = b!.options.sort();
    for (let i = 0; i < aOptions.length; i++) {
      if (!this.#equalUsingType(aOptions[i], bOptions[i])) return false;
    }
    return true;
  }
})();
