import { Model, AjvValidator } from 'objection';
import addFormats from 'ajv-formats';

export class ExtendedModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: true,
        ownProperties: true,
      },
    });
  }

  static $beforeValidate(jsonSchema: any, json: any) {
    jsonSchema.properties.forEach((schema: any, propertyName: string) => {
      if (
        schema
        && typeof schema.format !== 'undefined'
        && schema.format === 'date-time'
      ) {
        const valueToValidate = json[propertyName];
        if (valueToValidate !== null && valueToValidate instanceof Date) {
          json[propertyName] = valueToValidate.toISOString();
        }
      }
    });
    return jsonSchema;
  }
}
