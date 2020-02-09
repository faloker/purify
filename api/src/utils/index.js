/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import { xml2json } from 'xml-js';
import stringSimilarity from 'string-similarity';

const removeAttribute = (value, parentElement) => {
  try {
    const keyNo = Object.keys(parentElement._parent).length;
    const keyName = Object.keys(parentElement._parent)[keyNo - 1];
    // eslint-disable-next-line no-param-reassign
    parentElement._parent[keyName] = value;
  } catch (e) {
    console.log(e);
  }
};

export const xmlToJson = data => {
  JSON.parse(
    xml2json(data, {
      compact: true,
      spaces: 4,
      ignoreAttributes: true,
      textFn: removeAttribute,
      cdataFn: removeAttribute,
    })
  );
};
