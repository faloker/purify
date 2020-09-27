import { xml2json } from 'xml-js';
import { get } from 'lodash';

const removeAttribute = (value, parentElement) => {
  try {
    const keyNo = Object.keys(parentElement._parent).length;
    const keyName = Object.keys(parentElement._parent)[keyNo - 1];
    parentElement._parent[keyName] = value;
  } catch (e) {
    console.log(e);
  }
};

export function matchPattern(fields: any, pattern: string) {
  let result = pattern;
  const matches = pattern.match(/[a-zA-Z0-9\_\.\[\]]+/gm);

  if (!matches) {
    return result;
  }

  for (let match of matches) {
    if (match.startsWith('[') && match.endsWith(']')) {
      match = match.replace(/^\[/, '').replace(/]$/, '');
    }
    result = result.replace(match, get(fields, match));
  }

  return result;
}

export function xmlToJson(data) {
  return JSON.parse(
    xml2json(data, {
      compact: true,
      spaces: 4,
      ignoreAttributes: true,
      textFn: removeAttribute,
      cdataFn: removeAttribute,
    })
  );
}
