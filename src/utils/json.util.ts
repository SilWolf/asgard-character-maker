import Ajv from "ajv";
const ajv = new Ajv();

const storedSchema: Record<string, unknown> = {};

export const validateJson = async (jsonObj: unknown, schemaSrc: string) => {
  const schema =
    storedSchema[schemaSrc] ??
    (await fetch(schemaSrc).then((res) => res.json()));
  storedSchema[schemaSrc] = schema;

  const validate = ajv.compile(schema);
  const isValid = validate(jsonObj);

  if (!isValid) {
    console.error(validate.errors);
    return {
      valid: false,
      errors: validate.errors,
    };
  }

  return {
    valid: true,
  };
};
