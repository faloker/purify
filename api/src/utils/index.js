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

const xmlToJson = (data) => JSON.parse(xml2json(data, {
  compact: true,
  spaces: 4,
  ignoreAttributes: true,
  textFn: removeAttribute,
  cdataFn: removeAttribute,
}));

const mergeIssues = (srcIssue, destIssue, mergeFields) => {
  const resIssueFields = destIssue.fields;
  for (const field of mergeFields) {
    resIssueFields[field] += `\n${srcIssue[field]}`;
  }
  return resIssueFields;
};

const getDuplicateLevel = (issues, newIssue) => {
  let highest = 0;
  let level = 0;
  let dupestIssue = {};

  for (const issue of issues) {
    if (issue.fields !== newIssue) {
      level = Math.round(stringSimilarity.compareTwoStrings(
        JSON.stringify(Object.values(issue.fields)), JSON.stringify(Object.values(newIssue)),
      ) * 100);
      if (highest < level) { highest = level; dupestIssue = issue; }
    }
  }
  return { highest, dupestIssue };
};

export { xmlToJson, getDuplicateLevel, mergeIssues };
