import { get, capitalize, startCase } from 'lodash';
import { formatDistance } from 'date-fns';

export const matchPattern = (fields, pattern) => {
  let result = pattern;
  const matches = pattern
    // eslint-disable-next-line no-useless-escape
    .match(/[a-zA-Z0-9\.\[\]]+/gm);

  for (let match of matches) {
    if (match.startsWith('[') && match.endsWith(']')) {
      match = match.replace(/^\[/, '').replace(/]$/, '');
    }
    result = result.replace(match, get(fields, match));
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
