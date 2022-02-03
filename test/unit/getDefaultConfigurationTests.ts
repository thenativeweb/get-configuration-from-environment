import { assert } from 'assertthat';
import { ConfigurationDefinition, getDefaultConfiguration } from '../../lib';

interface Configuration {
  foo: string;
  bar: number;
}

suite('getDefaultConfiguration', (): void => {
  test('retrieves the default values from a configuration definition.', async (): Promise<void> => {
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

    const configuration = await getDefaultConfiguration({ configurationDefinition });

    assert.that(configuration).is.equalTo({
      foo: 'bat',
      bar: 0
    });
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

    const configuration = await getDefaultConfiguration({ configurationDefinition });

    assert.that(configuration).is.equalTo({
      foo: 'bat',
      bar: 0
    });
  });
});
