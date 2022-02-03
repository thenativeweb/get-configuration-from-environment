import { ConfigurationDefinition } from './ConfigurationDefinition';
import { ConfigurationDefinitionItem } from './ConfigurationDefinitionItem';

const censorConfiguration = function <TConfiguration extends object> ({ configuration, configurationDefinition }: {
  configuration: TConfiguration;
  configurationDefinition: ConfigurationDefinition<TConfiguration>;
}): Record<string, any> {
  const censoredConfiguration: Record<string, any> = {};

  for (const [ key, rawDefinition ] of Object.entries(configurationDefinition)) {
    const definition = rawDefinition as ConfigurationDefinitionItem<any>;
    const value = (configuration as any)[key];

    if (definition.isPrivate) {
      censoredConfiguration[key] = '****';
    } else {
      censoredConfiguration[key] = value;
    }
  }

  return censoredConfiguration;
};

export {
  censorConfiguration
};
