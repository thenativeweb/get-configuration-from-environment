import { assert } from 'assertthat';
import { nodeenv } from 'nodeenv';
import { ConfigurationDefinition, fromEnvironmentVariables } from '../../lib';

interface Configuration {
  foo: string;
  bar: number;
}

suite('fromEnvironmentVariables', (): void => {
  test('reads environment variables according to a configuraton definition.', async (): Promise<void> => {
    const configurationDefinition: ConfigurationDefinition<Configuration> = {
      foo: {
        environmentVariable: 'FOO_ENV_VAR',
        defaultValue: 'bat',
        schema: { type: 'string' }
      },
      bar: {
        environmentVariable: 'BAR',
        defaultValue: 0,
        schema: { type: 'number' }
      }
    };

    /* eslint-disable @typescript-eslint/naming-convention */
    const reset = nodeenv({
      FOO_ENV_VAR: 'foo',
      BAR: '5'
    });
    /* eslint-enable @typescript-eslint/naming-convention */

    const configuration = await fromEnvironmentVariables({ configurationDefinition });

    assert.that(configuration.unwrapOrThrow()).is.equalTo({
      foo: 'foo',
      bar: 5
    });

    reset();
  });

  test(`validates the environment variables' values and fails if they are malformed.`, async (): Promise<void> => {
    const configurationDefinition: ConfigurationDefinition<{ foo: string }> = {
      foo: {
        environmentVariable: 'FOO_ENV_VAR',
        defaultValue: 'bat',
        schema: { type: 'string', minLength: 3 }
      }
    };

    /* eslint-disable @typescript-eslint/naming-convention */
    const reset = nodeenv({
      FOO_ENV_VAR: 'h'
    });
    /* eslint-enable @typescript-eslint/naming-convention */

    const configuration = await fromEnvironmentVariables({ configurationDefinition });

    assert.that(configuration).is.anError();

    reset();
  });

  test('if a default value is a function, it executes the function to retrieve the default value.', async (): Promise<void> => {
    const configurationDefinition: ConfigurationDefinition<Configuration> = {
      foo: {
        environmentVariable: 'FOO_ENV_VAR',
        async defaultValue (): Promise<string> {
          return 'bat';
        },
        schema: { type: 'string' }
      },
      bar: {
        environmentVariable: 'BAR',
        async defaultValue (): Promise<number> {
          return 0;
        },
        schema: { type: 'number' }
      }
    };

    /* eslint-disable @typescript-eslint/naming-convention */
    const reset = nodeenv({
      FOO_ENV_VAR: undefined,
      BAR: undefined
    });
    /* eslint-enable @typescript-eslint/naming-convention */

    const configuration = await fromEnvironmentVariables({ configurationDefinition });

    assert.that(configuration.unwrapOrThrow()).is.equalTo({
      foo: 'bat',
      bar: 0
    });

    reset();
  });
});
