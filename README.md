# get-configuration-from-environment

get-configuration-from-environment gets an application configuration from environment variables.

## Status

| Category         | Status                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Version          | [![npm](https://img.shields.io/npm/v/get-configuration-from-environment)](https://www.npmjs.com/package/get-configuration-from-environment)                                                      |
| Dependencies     | ![David](https://img.shields.io/david/thenativeweb/get-configuration-from-environment)                                                                                   |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/get-configuration-from-environment)                                                                               |
| Build            | ![GitHub Actions](https://github.com/thenativeweb/get-configuration-from-environment/workflows/Release/badge.svg?branch=main) |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/get-configuration-from-environment)                                                                         |

## Installation

```shell
$ npm install get-configuration-from-environment
```

## Quick Start

First you need to integrate get-configuration-from-environment into your application:

```javascript
const {
  fromEnvironmentVariables
} = require('get-configuration-from-environment');
```

If you use TypeScript, use the following code instead:

```typescript
import {
  ConfigurationDefinition,
  fromEnvironmentVariables
} from 'get-configuration-from-environment';
```

To get your application's configuration from the environment, you first have to define an interface for your configuration, and write an appropriate `ConfigurationDefinition`:

```typescript
interface Configuration {
  foo: string;
  bar: number;
}

const configurationDefinition: ConfigurationDefinition<Configuration> = {
  foo: {
    environmentVariable: 'FOO',
    defaultValue: 'foo-default',
    schema: { type: 'string' }
  },
  bar: {
    environmentVariable: 'BAR',
    defaultValue: 5,
    schema: { type: 'number' }
  }
};
```

Then you can use this configuration definition to retrieve the configuration from the environment:

```typescript
const configuration =
  await fromEnvironmentVariables({ configurationDefinition });

// Either the value from the environment variable, or 'foo-default'.
console.log(configuration.foo);
```

The resulting `configuration` object will contain the JSON-parsed contents of the environment variables or the default values that are defined in the configuration definition.

### Serializing a configuration

In some cases you want to _set_ environment variables rather than _get_ them. For these cases the `toEnvironmentVariables` function can be used to serialize a configuration object to environment-variable-compatible values:

```typescript
import {
  toEnvironmentVariables
} from 'get-configuration-from-environment';

const environmentVariables =
  toEnvironmentVariables({ configuration, configurationDefinition });
```

The constant `environmentVariables` now contains a `Record<string, string>` with JSON-stringified values from your configuration. You can e.g. pass these to [nodeenv](https://www.npmjs.com/package/nodeenv) or further stringify them to create a docker-compose manifest or something along these lines.

### Censoring values in a configuration

If you want to log the loaded configuration in your application, but do not want to leak secrets into your log storage, you can mark fields in your `ConfigurationDefinition` as private and use `censorConfiguration`:

```typescript
import {
  censorConfiguration,
  ConfigurationDefinition,
  fromEnvironmentVariables
} from 'get-configuration-from-environment';

interface Configuration {
  foo: string;
}

const configurationDefinition: ConfigurationDefinition<Configuration> = {
  foo: {
    environmentVariable: 'FOO',
    defaultValue: 'foo-default',
    schema: { type: 'string' },
    isPrivate: true
  }
};

const configuration = await fromEnvironmentVariables({ configurationDefinition });
const censoredConfiguration = censorConfiguration({ configuration, configurationDefinition });

console.log({ censoredConfiguration });
```

You'll notice that the value of `censoredConfiguration.foo` is no longer `foo-default`, but rather `****`.

### Retrieving only default values

If you want to build a configuration object solely from the configured defaults and ignore the actual environment, you can use `getDefaultConfiguration`:

```typescript
import {
  ConfigurationDefinition,
  getDefaultConfiguration
} from 'get-configuration-from-environment';

interface Configuration {
  foo: string;
}

const configurationDefinition: ConfigurationDefinition<Configuration> = {
  foo: {
    environmentVariable: 'FOO',
    defaultValue: 'foo-default',
    schema: { type: 'string' },
    isPrivate: true
  }
};

const defaultConfiguration =
  await getDefaultConfiguration({ configurationDefinition });
```

The constant `defaultConfiguration` now contains a configuration object exclusively made from the default values defined before. The environment is never inspected.

## Running quality assurance

To run quality assurance for this module use [roboter](https://www.npmjs.com/package/roboter):

```shell
$ npx roboter
```
