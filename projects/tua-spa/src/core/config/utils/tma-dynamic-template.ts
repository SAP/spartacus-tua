/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
export class TmaDynamicTemplate {
  static resolve(templateString: string, templateVariables: any) {
    for (const variableLabel of Object.keys(templateVariables)) {
      const placeholder = new RegExp('\\${' + variableLabel + '}', 'g');
      templateString = templateString.replace(
        placeholder,
        templateVariables[variableLabel]
      );
    }
    return templateString;
  }
}
