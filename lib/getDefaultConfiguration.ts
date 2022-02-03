import { ConfigurationDefinition } from './ConfigurationDefinition';
import { ConfigurationDefinitionItem } from './ConfigurationDefinitionItem';

const getDefaultConfiguration = async function <TConfiguration extends object> ({ configurationDefinition }: {
  configurationDefinition: ConfigurationDefinition<TConfiguration>;
}): Promise<TConfiguration> {
  const configuration: Record<string, any> = {};

  for (const [ key, rawDefinition ] of Object.entries(configurationDefinition)) {
    const definition = rawDefinition as ConfigurationDefinitionItem<any>;

    if (typeof definition.defaultValue === 'function') {
      configuration[key] = await definition.defaultValue();
    } else {
      configuration[key] = definition.defaultValue;
    }
  }

  return configuration as TConfiguration;
};

export { getDefaultConfiguration };
