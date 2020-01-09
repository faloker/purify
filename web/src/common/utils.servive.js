import _ from 'lodash';

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const matchPattern = (source, template) => {
  const resolve = match => _.get(source, match.replace(/[{}]/g, ''));
  return template.replace(/(\{.[^}]*\})/g, resolve);
};

const dateDiffInDays = (a, b) => {
  a = new Date(a);
  b = new Date(b);
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export { matchPattern, dateDiffInDays };
