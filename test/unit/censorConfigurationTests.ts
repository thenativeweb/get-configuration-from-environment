import { assert } from 'assertthat';
import { censorConfiguration, ConfigurationDefinition, getDefaultConfiguration } from '../../lib';

suite('censorConfiguration', (): void => {
  test('censors fields marked as private.', async (): Promise<void> => {
    interface Configuration {
      foo: string;
      bar: string;
      heck: string;
    }

    const configurationDefinition: ConfigurationDefinition<Configuration> = {
      foo: {
        defaultValue: 'foo',
        environmentVariable: 'FOO',
        schema: { type: 'string' },
        isPrivate: true
      },
      bar: {
        defaultValue: 'bar',
        environmentVariable: 'BAR',
        schema: { type: 'string' },
        isPrivate: false
      },
      heck: {
        defaultValue: 'heck',
        environmentVariable: 'HEK',
        schema: { type: 'string' },
        isPrivate: false
      }
    };

    const configuration = await getDefaultConfiguration({ configurationDefinition });

    const censoredConfiguration = censorConfiguration({ configuration, configurationDefinition });

    assert.that(censoredConfiguration).is.equalTo({
      foo: '****',
      bar: 'bar',
      heck: 'heck'
    });
  });
});
