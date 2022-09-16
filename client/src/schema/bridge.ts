import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { capitalize } from 'lodash';
import { prepareModel } from '../utils/prepareModel';

const ajv = new Ajv({
  allErrors: true,
  useDefaults: false,
  strict: false,
  $data: true,
});

ajv.addFormat('time', {
  validate: (timeStringValue: string) =>
    timeStringValue.match(/^([01]\d|2[0-3]):?([0-5]\d)$/) !== null,
});

addFormats(ajv, ['date', 'email']);

function createValidator(schema: Object) {
  const validator = ajv.compile(schema);

  return (model: Record<string, any>) => {
    validator(prepareModel(model));

    const errors =
      validator.errors
        ?.filter((error) => error.keyword !== 'type')
        .map((error) => {
          if (error.keyword === 'required') {
            error.message = 'Obavezno polje';
          }

          if (error.keyword === 'format' && error.params.format === 'email') {
            error.message = 'Netočna email adresa';
          }

          if (
            error.keyword === 'const' &&
            error.instancePath.includes('confirmPassword')
          ) {
            error.message = 'Lozinke moraju biti jednake';
          }

          if (error.params.format === 'time') {
            error.message = 'Neispravno vrijeme';
          }

          error.message = capitalize(error.message);

          return error;
        }) || [];

    return errors.length ? { details: errors } : null;
  };
}

export const bridge = (schema: Object) => {
  const schemaValidator = createValidator(schema);

  return new JSONSchemaBridge(schema, schemaValidator);
};
