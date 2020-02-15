// eslint-disable-next-line import/prefer-default-export
export const matchPattern = (fields, template) => {
  let result = template;
  for (const field of Object.keys(fields)) {
    if (template.includes(field)) {
      result = result.replace(field, fields[field]);
    }
  }
  return result;
};
