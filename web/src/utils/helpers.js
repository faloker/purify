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

const isPrintable = obj => ['string', 'boolean', 'number'].includes(typeof obj);

const decodeValue = str => atob(str);


const parseField = (field, fieldValue) => {
  let mkdwn = '';
  const fieldKey = field.key || field;
  const fieldType = field.type || 'text';

  if (isPrintable(fieldValue)) {
    mkdwn += `## ${parseKey(fieldKey)}\n`;

    if (fieldType === 'base64') {
      mkdwn += `${decodeValue(fieldValue)}\n\n`;
    } else {
      mkdwn += `${fieldValue}\n\n`;
    }
  } else if (Array.isArray(fieldValue)) {
    if (isPrintable(fieldValue[0])) {
      mkdwn += `## ${parseKey(fieldKey)}\n`;

      for (const element of fieldValue) {
        mkdwn += `* ${element}\n`;
      }

      mkdwn += '\n';
    } else if (typeof fieldValue[0] === 'object') {
      mkdwn += `## ${parseKey(fieldKey)}\n`;

      for (const [index, element] of fieldValue.entries()) {
        mkdwn += `<details><summary><b># ${index}</b></summary><p>\n\n`;

        for (const key of Object.keys(element)) {
          mkdwn += parseField(key, element[key]);
        }

        mkdwn += '</p></details>';
      }
    } else if (typeof fieldValue === 'object') {
      for (const key of Object.keys(fieldValue)) {
        mkdwn += parseField(key, fieldValue[key]);
      }
    }
  }

  return mkdwn;
};

export const prepareMarkdown = issue => {
  let result = '';

  for (const field of issue.template.body_fields) {
    result += parseField(field, getValue(issue.fields, field.key));
  }

  return result;
};
