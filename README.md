# command-line-docs

Generate markdown documentation based on your [command-line-application](https://github.com/hipstersmoothie/command-line-application) command definitions

## Installation

```sh
npm i -D command-line-docs
# or
yarn add -D command-line-docs
```

## Usage

This package support both the `Command` and `MultiCommand` from [command-line-application](https://github.com/hipstersmoothie/command-line-application).

```js
import { Command } from 'command-line-application';
import docs from 'command-line-docs';

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

console.log(docs(echo));
```

This will output:

```md
# `echo`

Print a string to the terminal

## Options

| Flag        | Type   | Description        |
| ----------- | ------ | ------------------ |
| \`--value\` | String | The value to print |
```

## Options

### Depth

Control the header depth.

```js
// Now the docs will start with an h2 instead of an h1
docs(echo, { depth: 1 });
```

### Including global options with each sub-command

You might want to include the global options in each sub-command's options table. To do this use the `includeGlobalOptionsForSubCommands` option.

```js
docs(echo, { includeGlobalOptionsForSubCommands: true });
```
