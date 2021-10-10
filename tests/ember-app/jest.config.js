// @ts-check
'use strict';

const { defaults } = require('jest-config');

module.exports = async () => {
  /** @type {import('@jest/types').Config.InitialOptions} */
  let config = {
    testMatch: ['**/*test.mjs'],
    moduleFileExtensions: [
      ...defaults.moduleFileExtensions,
      'mjs',
      'ts',
      'tsx',
    ],
  };

  return config;
};
