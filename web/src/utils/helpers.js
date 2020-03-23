import { get, capitalize, startCase } from 'lodash';
import { formatDistance } from 'date-fns';

export const matchPattern = (fields, template) => {
  let result = template;
  for (const field of Object.keys(fields)) {
    if (template.includes(field)) {
      result = result.replace(field, fields[field]);
    }
  }
  return result;
};

export const parseKey = key => {
  const res = key.includes('.')
    ? key.match(/\.[^.]+$/)[0].replace('.', '')
    : key;
  return capitalize(startCase(res));
};

export const getValue = (fields, key) => get(fields, key);

export const formatDate = date => `${formatDistance(new Date(date), new Date())} ago`;
