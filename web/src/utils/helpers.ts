import { get, capitalize, startCase } from 'lodash';
import { formatDistance, formatRFC7231 } from 'date-fns';
import { Issue, Template, BodyField } from '@/store/types';

export function matchPattern(fields: any, pattern: string) {
  if (pattern) {
    let result = pattern;
    const matches = pattern.match(/[a-zA-Z0-9\_\.\[\]]+/gm) as RegExpMatchArray;

    for (let match of matches) {
      if (match.startsWith('[') && match.endsWith(']')) {
        match = match.replace(/^\[/, '').replace(/]$/, '');
      }
      result = result.replace(match, get(fields, match));
    }

    return result;
  }
}

export function parseKey(key: string) {
  const res = key.includes('.')
    ? (key.match(/\.[^.]+$/) as RegExpMatchArray)[0].replace('.', '')
    : key;
  return capitalize(startCase(res));
}

export function getValue(fields: any, key: string) {
  return get(fields, key);
}

export function formatDate(date: Date) {
  return `${formatDistance(new Date(date), new Date())} ago`;
}

export function formatDateTooltip(date: Date) {
  return formatRFC7231(new Date(date));
}

export function isPrintable(obj: any) {
  return ['string', 'boolean', 'number'].includes(typeof obj);
}

function decodeValue(str: string) {
  return atob(str);
}

function parseField(field: any, fieldValue: any) {
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

        mkdwn += '</p></details>\n\n';
      }
    } else if (typeof fieldValue === 'object') {
      for (const key of Object.keys(fieldValue)) {
        // @ts-ignore
        mkdwn += parseField(key, fieldValue[key]);
      }
    }
  }

  return mkdwn;
}

export function prepareMarkdown(issue: Issue, template: Template) {
  let result = '';

  for (const field of template.body_fields) {
    result += parseField(field, getValue(issue.fields, field.key));
  }

  return result;
}

export function getRiskColor(value: string) {
  switch (value) {
    case 'info':
      return 'light-blue lighten-3';
    case 'low':
      return 'blue';
    case 'medium':
      return 'orange';
    case 'high':
      return 'red';
    case 'critical':
      return 'red darken-4';
    default:
      return 'grey';
  }
}

export function getFilterIcon(value: string) {
  switch (value) {
    case 'risk':
      return 'fa-bug';
    case 'resolution':
      return 'mdi-thumbs-up-down';
    case 'ticket':
      return 'mdi-cards';
    case 'status':
      return 'mdi-checkbox-marked-circle-outline';
    case 'template':
      return 'mdi-file';
    case 'search':
      return 'short_text';
  }
}
