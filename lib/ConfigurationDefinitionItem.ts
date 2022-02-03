import { JsonSchema } from 'validate-value';

export interface ConfigurationDefinitionItem<T> {
  environmentVariable: string;
  schema: JsonSchema;
  defaultValue: T | (() => T) | (() => Promise<T>);
  isPrivate?: boolean;
}
