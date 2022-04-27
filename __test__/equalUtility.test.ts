import { SlashCommandBuilder } from "@discordjs/builders";
import { APIApplicationCommand } from "discord-api-types/v10";
import { APIApplicationCommandBase, EqualUtility } from "../src/equalUtility";

it("should return true (using SlashCommandBuilder)", () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName("test");
  firstTestCommand.setDescription("test");

  const secondTestCommand = new SlashCommandBuilder();
  secondTestCommand.setName("test");
  secondTestCommand.setDescription("test");

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      secondTestCommand.toJSON() as APIApplicationCommand
    )
  ).toBe(true);
});

it("should return true (using SlashCommandBuilder and JSON)", () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName("test");
  firstTestCommand.setDescription("test");

  const secondTestCommand = {
    name: "test",
    name_localizations: undefined,
    description: "test",
    description_localizations: undefined,
    options: [],
    default_permission: undefined,
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      // @ts-expect-error
      secondTestCommand
    )
  ).toBe(true);
});

it("should return true (using SlashCommandBuilder and JSON, using null instead of undefined)", () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName("test");
  firstTestCommand.setDescription("test");

  const secondTestCommand = {
    name: "test",
    name_localizations: null,
    description: "test",
    description_localizations: null,
    options: [],
    default_permission: null,
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      // @ts-expect-error
      secondTestCommand
    )
  ).toBe(true);
});

it("should return true (using complex SlashCommandBuilder)", () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName("test");
  firstTestCommand.setDescription("test");
  firstTestCommand.addStringOption((option) =>
    option.setName("test").setDescription("test")
  );
  firstTestCommand.addAttachmentOption((option) =>
    option.setName("test").setDescription("test")
  );
  firstTestCommand.addBooleanOption((option) =>
    option.setName("test").setDescription("test")
  );
  firstTestCommand.addMentionableOption((option) =>
    option.setName("test").setDescription("test")
  );
  firstTestCommand.addSubcommand((builder) =>
    builder
      .setName("test")
      .setDescription("test")
      .addStringOption((option) =>
        option.setName("test").setDescription("test")
      )
      .addAttachmentOption((option) =>
        option.setName("test").setDescription("test")
      )
  );

  const secondTestCommand = new SlashCommandBuilder();
  secondTestCommand.setName("test");
  secondTestCommand.setDescription("test");
  secondTestCommand.addStringOption((option) =>
    option.setName("test").setDescription("test")
  );
  secondTestCommand.addAttachmentOption((option) =>
    option.setName("test").setDescription("test")
  );
  secondTestCommand.addBooleanOption((option) =>
    option.setName("test").setDescription("test")
  );
  secondTestCommand.addMentionableOption((option) =>
    option.setName("test").setDescription("test")
  );
  secondTestCommand.addSubcommand((builder) =>
    builder
      .setName("test")
      .setDescription("test")
      .addStringOption((option) =>
        option.setName("test").setDescription("test")
      )
      .addAttachmentOption((option) =>
        option.setName("test").setDescription("test")
      )
  );

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      secondTestCommand.toJSON() as APIApplicationCommand
    )
  ).toBe(true);
});

it("should return true (using complex SlashCommandBuilder and JSON, using null instead of undefined)", () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName("test");
  firstTestCommand.setDescription("test");
  firstTestCommand.addStringOption((option) =>
    option.setName("test").setDescription("test")
  );
  firstTestCommand.addAttachmentOption((option) =>
    option.setName("test").setDescription("test")
  );
  firstTestCommand.addBooleanOption((option) =>
    option.setName("test").setDescription("test")
  );
  firstTestCommand.addMentionableOption((option) =>
    option.setName("test").setDescription("test")
  );
  firstTestCommand.addSubcommand((builder) =>
    builder
      .setName("test")
      .setDescription("test")
      .addStringOption((option) =>
        option.setName("test").setDescription("test")
      )
      .addAttachmentOption((option) =>
        option.setName("test").setDescription("test")
      )
  );

  const secondTestCommand = {
    name: "test",
    name_localizations: null,
    description: "test",
    description_localizations: null,
    options: [
      {
        choices: null,
        autocomplete: null,
        type: 3,
        name: "test",
        name_localizations: null,
        description: "test",
        description_localizations: null,
        required: false,
      },
      {
        name: "test",
        name_localizations: null,
        description: "test",
        description_localizations: null,
        required: false,
        type: 11,
      },
      {
        name: "test",
        name_localizations: null,
        description: "test",
        description_localizations: null,
        required: false,
        type: 5,
      },
      {
        name: "test",
        name_localizations: null,
        description: "test",
        description_localizations: null,
        required: false,
        type: 9,
      },
      {
        type: 1,
        name: "test",
        description: "test",
        options: [
          {
            type: 3,
            name: "test",
            description: "test",
            required: false,
          },
          {
            name: "test",
            description: "test",
            required: false,
            type: 11,
          },
        ],
      },
    ],
    default_permission: null,
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      // @ts-expect-error
      secondTestCommand
    )
  ).toBe(true);
});

it("should return true (using complex JSON, using null instead of undefined and missing array)", () => {
  const firstTestCommand = {
    name: "test",
    name_localizations: undefined,
    description: "test",
    description_localizations: undefined,
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: "test",
        name_localizations: undefined,
        description: "test",
        description_localizations: undefined,
        required: false,
      },
      {
        name: "test",
        name_localizations: undefined,
        description: "test",
        description_localizations: undefined,
        required: false,
        type: 11,
      },
      {
        name: "test",
        name_localizations: undefined,
        description: "test",
        description_localizations: undefined,
        required: false,
        type: 5,
      },
      {
        name: "test",
        name_localizations: undefined,
        description: "test",
        description_localizations: undefined,
        required: false,
        type: 9,
      },
      {
        type: 1,
        name: "test",
        description: "test",
        options: [
          {
            type: 3,
            name: "test",
            description: "test",
            required: false,
          },
          {
            name: "test",
            description: "test",
            required: false,
            type: 11,
          },
        ],
      },
      {
        type: 1,
        name: "test",
        description: "test",
        options: undefined,
      },
    ],
    default_permission: undefined,
  };

  const secondTestCommand = {
    name: "test",
    name_localizations: null,
    description: "test",
    description_localizations: null,
    options: [
      {
        choices: null,
        autocomplete: null,
        type: 3,
        name: "test",
        name_localizations: null,
        description: "test",
        description_localizations: null,
        required: false,
      },
      {
        name: "test",
        name_localizations: null,
        description: "test",
        description_localizations: null,
        required: false,
        type: 11,
      },
      {
        name: "test",
        name_localizations: null,
        description: "test",
        description_localizations: null,
        required: false,
        type: 5,
      },
      {
        name: "test",
        name_localizations: null,
        description: "test",
        description_localizations: null,
        required: false,
        type: 9,
      },
      {
        type: 1,
        name: "test",
        description: "test",
        options: [
          {
            type: 3,
            name: "test",
            description: "test",
            required: false,
          },
          {
            name: "test",
            description: "test",
            required: false,
            type: 11,
          },
        ],
      },
      {
        type: 1,
        name: "test",
        description: "test",
        options: null,
      },
    ],
    default_permission: null,
  };

  expect(
    EqualUtility.isCommandEqual(
      //@ts-expect-error
      firstTestCommand as APIApplicationCommandBase,
      //@ts-expect-error
      secondTestCommand as APIApplicationCommandBase
    )
  ).toBe(true);
});
