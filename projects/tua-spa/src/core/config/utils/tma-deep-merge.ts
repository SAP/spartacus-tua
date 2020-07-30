/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
export function tmaIsObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function tmaDeepMerge(target = {}, ...sources: any[]): any {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift() || {};

  if (tmaIsObject(target) && tmaIsObject(source)) {
    for (const key in source) {
      if (source[key] instanceof Date) {
        Object.assign(target, { [key]: source[key] });
      } else if (tmaIsObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        tmaDeepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return tmaDeepMerge(target, ...sources);
}
