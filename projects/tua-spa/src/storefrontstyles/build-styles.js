/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const sass = require('sass');
const fs = require('fs');
const importer = require('./importer');

const file = './src/storefrontstyles/_index.scss';
const outFile = './src/storefrontstyles/output.css';

sass.render(
  {
    file,
    outFile,
    importer,
  },
  function (error, result) {
    if (error) {
      throw error;
    } else {
      fs.writeFile(outFile, result.css, function () {});
    }
  }
);
