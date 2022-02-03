import { assert } from 'assertthat';
import { ConfigurationDefinition, toEnvironmentVariables } from '../../lib';

interface Configuration {
  foo: string;
  bar: {
    baz: number;
  };
}

suite('toEnvironmentVariables', (): void => {
  test('builds a record of environment variables from a configuration and a configuration definition.', async (): Promise<void> => {
    const configuration: Configuration = {
      foo: 'baz',
      bar: { baz: 5 }
    };

    const configurationDefinition: ConfigurationDefinition<Configuration> = {
      foo: {
        environmentVariable: 'FOO_ENV_VAR',
        defaultValue: 'bat',
        schema: { type: 'string' }
      },
      bar: {
        environmentVariable: 'BAR',
        defaultValue: { baz: 0 },
        schema: {
          type: 'object',
          properties: {
            baz: { type: 'number' }
          },
          additionalProperties: false
        }
      }
    };

    const environmentVariables = toEnvironmentVariables({ configuration, configurationDefinition });

    /* eslint-disable @typescript-eslint/naming-convention */
    assert.that(environmentVariables).is.equalTo({
      FOO_ENV_VAR: 'baz',
      BAR: '{"baz":5}'
    });
    /* eslint-enable @typescript-eslint/naming-convention */
  });
});
