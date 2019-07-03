import { Command, MultiCommand } from 'command-line-application';

import commandLineDocs from '../src';

describe('single command app', () => {
  test('basic', () => {
    const echo: Command = {
      name: 'echo',
      description: 'Print a string to the terminal',
      options: [
        {
          name: 'value',
          type: String,
          defaultOption: true,
          description: 'The value to print',
        },
      ],
    };

    expect(commandLineDocs(echo)).toMatchSnapshot();
  });

  test('with examples', () => {
    const echo: Command = {
      name: 'echo',
      description: 'Print a string to the terminal',
      examples: ['echo foo', 'echo "Intense message"'],
      options: [
        {
          name: 'value',
          type: String,
          defaultOption: true,
          description: 'The value to print',
        },
      ],
    };

    expect(commandLineDocs(echo)).toMatchSnapshot();
  });
});

test('MultiCommand', () => {
  const testCommand: Command = {
    name: 'test',
    description: 'test the project',
    examples: ['test --interactive'],
    options: [
      {
        name: 'interactive',
        type: Boolean,
        description: 'Run the application in interactive mode',
      },
    ],
  };
  const lintCommand: Command = {
    name: 'lint',
    description: 'lint the project',
    examples: ['lint --fix'],
    options: [
      {
        name: 'fix',
        type: Boolean,
        description: 'Run the application in fix mode',
      },
    ],
  };
  const scripts: MultiCommand = {
    name: 'scripts',
    description: 'My scripts package',
    commands: [lintCommand, testCommand],
    options: [
      {
        name: 'verbose',
        alias: 'v',
        description: 'Log a bunch of stuff',
        type: Boolean,
      },
    ],
  };

  expect(commandLineDocs(scripts)).toMatchSnapshot();
});
