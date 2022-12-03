import type { APIApplicationCommand } from 'discord-api-types/v10';
import { SlashCommandBuilder } from '@discordjs/builders';
import { EqualUtility } from '../src/equalUtility';

it('should return true (using SlashCommandBuilder)', () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName('test');
  firstTestCommand.setDescription('test');

  const secondTestCommand = new SlashCommandBuilder();
  secondTestCommand.setName('test');
  secondTestCommand.setDescription('test');

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      secondTestCommand.toJSON() as APIApplicationCommand
    )
  ).toBe(true);
});

it('should return true (using SlashCommandBuilder and JSON)', () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName('test');
  firstTestCommand.setDescription('test');

  const secondTestCommand = {
    name: 'test',
    name_localizations: undefined,
    description: 'test',
    description_localizations: undefined,
    options: [],
    default_permission: undefined
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      // @ts-expect-error
      secondTestCommand
    )
  ).toBe(true);
});

it('should return true (using SlashCommandBuilder and JSON)', () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName('test');
  firstTestCommand.setDescription('test');

  const secondTestCommand = {
    name: 'test',
    name_localizations: null,
    description: 'test',
    description_localizations: null,
    options: [],
    default_permission: null
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      // @ts-expect-error
      secondTestCommand
    )
  ).toBe(true);
});

it('should return true (using complex SlashCommandBuilder)', () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName('test');
  firstTestCommand.setDescription('test');
  firstTestCommand.addStringOption((option) => option.setName('test').setDescription('test'));
  firstTestCommand.addAttachmentOption((option) => option.setName('test').setDescription('test'));
  firstTestCommand.addBooleanOption((option) => option.setName('test').setDescription('test'));
  firstTestCommand.addMentionableOption((option) => option.setName('test').setDescription('test'));
  firstTestCommand.addSubcommand((builder) =>
    builder
      .setName('test')
      .setDescription('test')
      .addStringOption((option) => option.setName('test').setDescription('test'))
      .addAttachmentOption((option) => option.setName('test').setDescription('test'))
  );

  const secondTestCommand = new SlashCommandBuilder();
  secondTestCommand.setName('test');
  secondTestCommand.setDescription('test');
  secondTestCommand.addStringOption((option) => option.setName('test').setDescription('test'));
  secondTestCommand.addAttachmentOption((option) => option.setName('test').setDescription('test'));
  secondTestCommand.addBooleanOption((option) => option.setName('test').setDescription('test'));
  secondTestCommand.addMentionableOption((option) => option.setName('test').setDescription('test'));
  secondTestCommand.addSubcommand((builder) =>
    builder
      .setName('test')
      .setDescription('test')
      .addStringOption((option) => option.setName('test').setDescription('test'))
      .addAttachmentOption((option) => option.setName('test').setDescription('test'))
  );

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      secondTestCommand.toJSON() as APIApplicationCommand
    )
  ).toBe(true);
});

//--------------------------------------------------------------------------------

it('should return false (using SlashCommandBuilder)', () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName('test');
  firstTestCommand.setDescription('test');

  const secondTestCommand = new SlashCommandBuilder();
  secondTestCommand.setName('test');
  secondTestCommand.setDescription('tes');

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      secondTestCommand.toJSON() as APIApplicationCommand
    )
  ).toBe(false);
});

it('should return false (using SlashCommandBuilder and JSON)', () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName('test');
  firstTestCommand.setDescription('test');

  const secondTestCommand = {
    name: 'test',
    name_localizations: undefined,
    description: 'tes',
    description_localizations: undefined,
    options: [],
    default_permission: undefined
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      // @ts-expect-error
      secondTestCommand
    )
  ).toBe(false);
});

it('should return false (using SlashCommandBuilder and JSON)', () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName('test');
  firstTestCommand.setDescription('test');

  const secondTestCommand = {
    name: 'tes',
    name_localizations: null,
    description: 'test',
    description_localizations: null,
    options: [],
    default_permission: null
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      // @ts-expect-error
      secondTestCommand
    )
  ).toBe(false);
});

it('should return false (using complex SlashCommandBuilder)', () => {
  const firstTestCommand = new SlashCommandBuilder();
  firstTestCommand.setName('test');
  firstTestCommand.setDescription('test');
  firstTestCommand.addStringOption((option) => option.setName('test').setDescription('test'));
  firstTestCommand.addAttachmentOption((option) => option.setName('test').setDescription('test'));
  firstTestCommand.addBooleanOption((option) => option.setName('test').setDescription('test'));
  firstTestCommand.addMentionableOption((option) => option.setName('test').setDescription('test'));
  firstTestCommand.addSubcommand((builder) =>
    builder
      .setName('test')
      .setDescription('test')
      .addStringOption((option) => option.setName('test').setDescription('tes'))
      .addAttachmentOption((option) => option.setName('test').setDescription('test'))
  );

  const secondTestCommand = new SlashCommandBuilder();
  secondTestCommand.setName('test');
  secondTestCommand.setDescription('test');
  secondTestCommand.addStringOption((option) => option.setName('test').setDescription('test'));
  secondTestCommand.addAttachmentOption((option) => option.setName('test').setDescription('test'));
  secondTestCommand.addBooleanOption((option) => option.setName('test').setDescription('test'));
  secondTestCommand.addMentionableOption((option) => option.setName('test').setDescription('test'));
  secondTestCommand.addSubcommand((builder) =>
    builder
      .setName('test')
      .setDescription('test')
      .addStringOption((option) => option.setName('test').setDescription('test'))
      .addAttachmentOption((option) => option.setName('test').setDescription('test'))
  );

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand.toJSON() as APIApplicationCommand,
      secondTestCommand.toJSON() as APIApplicationCommand
    )
  ).toBe(false);
});

it('should return false (using complex JSON and missing array)', () => {
  const firstTestCommand = {
    name: 'test',
    name_localizations: undefined,
    description: 'test',
    description_localizations: undefined,
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'test',
        name_localizations: undefined,
        description: 'test',
        description_localizations: undefined,
        required: false
      },
      {
        name: 'test',
        name_localizations: undefined,
        description: 'test',
        description_localizations: undefined,
        required: false,
        type: 11
      },
      {
        name: 'test',
        name_localizations: undefined,
        description: 'test',
        description_localizations: undefined,
        required: false,
        type: 5
      },
      {
        name: 'test',
        name_localizations: undefined,
        description: 'test',
        description_localizations: undefined,
        required: false,
        type: 9
      },
      {
        type: 1,
        name: 'test',
        description: 'test',
        options: [
          {
            type: 3,
            name: 'test',
            description: 'test',
            required: false
          },
          {
            name: 'test',
            description: 'test',
            required: false,
            type: 11
          }
        ]
      },
      {
        type: 1,
        name: 'test',
        description: 'test',
        options: undefined
      }
    ],
    default_permission: undefined
  };

  const secondTestCommand = {
    name: 'test',
    name_localizations: null,
    description: 'test',
    description_localizations: null,
    options: [
      {
        choices: null,
        autocomplete: null,
        type: 3,
        name: 'test',
        name_localizations: null,
        description: 'test',
        description_localizations: null,
        required: false
      },
      {
        name: 'test',
        name_localizations: null,
        description: 'test',
        description_localizations: null,
        required: false,
        type: 11
      },
      {
        name: 'test',
        name_localizations: null,
        description: 'test',
        description_localizations: null,
        required: false,
        type: 5
      },
      {
        name: 'test',
        name_localizations: null,
        description: 'test',
        description_localizations: null,
        required: false,
        type: 9
      },
      {
        type: 1,
        name: 'test',
        description: 'test',
        options: [
          {
            type: 3,
            name: 'test',
            description: 'tes',
            required: false
          },
          {
            name: 'test',
            description: 'test',
            required: false,
            type: 11
          }
        ]
      },
      {
        type: 1,
        name: 'test',
        description: 'test',
        options: null
      }
    ],
    default_permission: null
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand as APIApplicationCommand,
      secondTestCommand as unknown as APIApplicationCommand
    )
  ).toBe(false);
});

it('should return false', () => {
  const firstTestCommand = {
    name: 'za',
    name_localizations: undefined,
    description: 'as',
    description_localizations: undefined,
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'qr',
        name_localizations: undefined,
        description: 'a',
        description_localizations: undefined,
        required: false
      },
      {
        name: 'l',
        name_localizations: undefined,
        description: 'b',
        description_localizations: undefined,
        required: false,
        type: 11
      },
      {
        name: 'w',
        name_localizations: undefined,
        description: 'f',
        description_localizations: undefined,
        required: false,
        type: 5
      },
      {
        name: 'z',
        name_localizations: undefined,
        description: 'm',
        description_localizations: undefined,
        required: false,
        type: 9
      },
      {
        type: 1,
        name: 'c',
        description: 'b',
        options: [
          {
            type: 3,
            name: 'g',
            description: 'tes',
            required: false
          },
          {
            name: 'e',
            description: 'a',
            required: false,
            type: 11
          }
        ]
      },
      {
        type: 1,
        name: 'h',
        description: '2',
        options: undefined
      }
    ],
    default_permission: undefined
  };

  const secondTestCommand = {
    name: 'a',
    name_localizations: null,
    description: 'b',
    description_localizations: null,
    options: [
      {
        choices: null,
        autocomplete: null,
        type: 3,
        name: 'c',
        name_localizations: null,
        description: 'd',
        description_localizations: null,
        required: false
      },
      {
        name: 'e',
        name_localizations: null,
        description: 'f',
        description_localizations: null,
        required: false,
        type: 11
      },
      {
        name: 'g',
        name_localizations: null,
        description: 'h',
        description_localizations: null,
        required: false,
        type: 5
      },
      {
        name: 'i',
        name_localizations: null,
        description: 'j',
        description_localizations: null,
        required: false,
        type: 9
      },
      {
        type: 1,
        name: 'k',
        description: 'm',
        options: [
          {
            type: 3,
            name: 'n',
            description: 'o',
            required: false
          },
          {
            name: 'p',
            description: 'q',
            required: false,
            type: 11
          }
        ]
      },
      {
        type: 1,
        name: 'r',
        description: 's',
        options: null
      }
    ],
    default_permission: null
  };

  expect(
    EqualUtility.isCommandEqual(
      firstTestCommand as APIApplicationCommand,
      secondTestCommand as unknown as APIApplicationCommand
    )
  ).toBe(false);
});
