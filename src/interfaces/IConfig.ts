import { ValidationType } from "../enums/ValidationType";

export interface IConfig {
  envPaths: string[];
  envExamplePath: string;
  schema: Record<string, ISchema>;
}

export interface ISchema {
  required: boolean;
  type: ValidationType;
}
