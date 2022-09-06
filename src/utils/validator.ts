import { ISchema } from "src/interfaces/IConfig";
import { ValidationType } from "src/enums/ValidationType";

interface IValidationResult {
  isValid: boolean;
  error: string;
}

/**
 * Validates a object based on the specified schema.
 */
export function validate<T extends {}>(
  schemaObject: Record<string, ISchema>,
  valueObject: T
): IValidationResult[] {
  return Object.entries(schemaObject).map(([key, schema]) => {
    const { isValid, error } = validateValue(schema, valueObject[key]);

    return {
      isValid,
      error: `${key}: ${error}`,
    };
  });
}

/**
 * Validates a single value based on the specified schema.
 */
export function validateValue<T extends string>(
  schema: ISchema,
  value: T
): IValidationResult {
  const { regex, error } = getValidationRegex(schema.type);

  const isValid = value?.match(regex)?.length > 0;

  if (schema.required && !value) {
    return {
      isValid: false,
      error: "This value is required",
    };
  }

  return {
    isValid,
    error: isValid ? "" : error,
  };
}

/**
 * Get's the regex for the specified validation type.
 */
function getValidationRegex(type: ValidationType): {
  regex: RegExp;
  error: string;
} {
  switch (type) {
    case ValidationType.url:
      return {
        regex: new RegExp(/^http:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/),
        error: "This value must be a valid url",
      };
    case ValidationType.email:
      return {
        regex: new RegExp(
          /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        ),
        error: "This value must be a valid email",
      };
    case ValidationType.uuid:
      return {
        regex: new RegExp(
          /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
        ),
        error: "This value must be a valid UUID",
      };
    case ValidationType.number:
      return {
        regex: new RegExp(/^\d+$/),
        error: "This value must be a valid number",
      };
    case ValidationType.string:
      return {
        regex: new RegExp(/.+/s),
        error: "This value must be a valid string",
      };
    default:
      throw new Error(`Unknown validation type: ${type}`);
  }
}
