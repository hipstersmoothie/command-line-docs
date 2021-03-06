import { Command, MultiCommand, Option } from 'command-line-application';

interface Options {
  depth?: number;
  includeGlobalOptionsForSubCommands?: boolean;
}

function H(depth: number) {
  return Array(depth)
    .fill('#')
    .join('');
}

function buildOptions(options: Option[]) {
  return `| Flag | Type | Description |\n| - | - | - |\n${options
    .map(option => {
      const ways = [`\`--${option.name}\``];

      if (option.alias) {
        ways.push(`\`-${option.alias}\``);
      }

      return `| ${ways.join(', ')} | ${
        option.typeLabel
          ? option.typeLabel.replace(/\|/g, '\\|')
          : option.type.name
      } | ${option.description} |`;
    })
    .join('\n')}`;
}

function buildExamples(command: Command) {
  if (!command.examples) {
    return;
  }

  return `${command.examples
    .map(example => {
      if (typeof example === 'string') {
        return `\`\`\`sh\n${example}\n\`\`\``;
      }

      return `${example.desc}\n\n \`\`\`sh\n${example.example}\n\`\`\``;
    })
    .join('\n\n')}`;
}

function createDocsForCommand(
  command: Command | MultiCommand,
  options: Required<Options>
) {
  const { depth } = options;
  let output = `${H(1 + depth)} \`${command.name}\`\n\n${
    command.description
  }\n\n`;

  if ('commands' in command) {
    output += `${H(2 + depth)} Commands\n\n${command.commands
      .map(c => `  - **${c.name}** - ${c.description}`)
      .join('\n')}\n\n`;
  }

  if (command.options) {
    output += `${H(2 + depth)} Options\n\n${buildOptions(command.options)}\n\n`;
  }

  if ('examples' in command) {
    output += `${H(2 + depth)} Examples\n\n${buildExamples(command)}\n\n`;
  }

  if ('commands' in command) {
    const globalOptions = command.options || [];
    command.commands.map(c => {
      const commandOptions = c.options || [];
      output += createDocsForCommand(
        options.includeGlobalOptionsForSubCommands
          ? { ...c, options: [...globalOptions, ...commandOptions] }
          : c,
        {
          ...options,
          depth: options.depth + 1,
        }
      );
    });
  }

  if ('footer' in command) {
    if (typeof command.footer === 'string') {
      output += command.footer;
    } else {
      const sections = Array.isArray(command.footer)
        ? command.footer
        : [command.footer];

      sections.forEach(section => {
        if (section) {
          if (section.header) {
            output += `${H(2 + depth)} ${section.header}\n\n`;
          }

          output += `${('optionList' in section &&
            buildOptions(section.optionList as Option[])) ||
            ('content' in section && section.content)}\n\n`;
        }
      });
    }
  }

  return output;
}

const defaultOptions: Options = {
  depth: 0,
  includeGlobalOptionsForSubCommands: false,
};

function commandLineDocs(
  params: Command | MultiCommand,
  userOptions: Options = {}
) {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  return createDocsForCommand(params, options as Required<Options>);
}

export default commandLineDocs;
