import { ConfigurationDefinition } from './ConfigurationDefinition';
import { ConfigurationDefinitionItem } from './ConfigurationDefinitionItem';
import { parse } from 'validate-value';
import { processenv } from 'processenv';
import { defekt, error, Result, value } from 'defekt';

class LoadingConfigurationFailed extends defekt({ code: 'LoadingConfigurationFailed' }) {}

const fromEnvironmentVariables = async function <TConfiguration extends object> ({ configurationDefinition }: {
  configurationDefinition: ConfigurationDefinition<TConfiguration>;
}): Promise<Result<TConfiguration, LoadingConfigurationFailed>> {
  const configuration: Record<string, any> = {};

  for (const [ key, rawDefinition ] of Object.entries(configurationDefinition)) {
    const definition = rawDefinition as ConfigurationDefinitionItem<any>;

    const environmentValue = await processenv(definition.environmentVariable, definition.defaultValue);

    const parseResult = parse(environmentValue, definition.schema);

    if (parseResult.hasError()) {
      return error(new LoadingConfigurationFailed({ cause: parseResult, data: { key, rawDefinition }}));
    }

    configuration[key] = parseResult.value;
  }

  return value(configuration as TConfiguration);
};

export {
  fromEnvironmentVariables,
  LoadingConfigurationFailed
};
