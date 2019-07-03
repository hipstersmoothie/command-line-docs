import { Command, MultiCommand } from 'command-line-application';

interface Options {
  depth?: number;
}

function H(depth: number) {
  return Array(depth)
    .fill('#')
    .join('');
}

function buildOptions(command: Command | MultiCommand) {
  if (!command.options) {
    return;
  }

  return `| Flag | Type | Description |\n| - | - | - |\n${command.options
    .map(option => {
      const ways = [`\`--${option.name}\``];

      if (option.alias) {
        ways.push(`\`-${option.alias}\``);
      }

      return `| ${ways.join(', ')} | ${option.typeLabel ||
        option.type.name} | ${option.description} |`;
    })
    .join('\n')}`;
}

function createDocsForMultiCommand(
  command: Command | MultiCommand,
  { depth }: Required<Options>
) {
  let output = `${H(1 + depth)} \`${command.name}\`\n\n${
    command.description
  }\n\n`;

  if ('commands' in command) {
    output += `${H(2 + depth)} Commands\n\n${command.commands
      .map(c => `  - **${c.name}** - ${c.description}`)
      .join('\n')}\n\n`;
  }

  if (command.options) {
    output += `${H(2 + depth)} Options\n\n${buildOptions(command)}\n\n`;
  }

  return output;
}

const defaultOptions = {
  depth: 0,
};

function commandLineDocs(
  params: Command | MultiCommand,
  userOptions: Options = {}
) {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  return createDocsForMultiCommand(params, options);
}

export default commandLineDocs;
