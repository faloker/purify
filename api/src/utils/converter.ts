import { xml2json } from 'xml-js';

const removeAttribute = (value, parentElement) => {
  try {
    const keyNo = Object.keys(parentElement._parent).length;
    const keyName = Object.keys(parentElement._parent)[keyNo - 1];
    parentElement._parent[keyName] = value;
  } catch (e) {
    console.log(e);
  }
};

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
};