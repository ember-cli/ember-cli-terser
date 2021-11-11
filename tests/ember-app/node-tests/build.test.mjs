'use strict';

import execa from 'execa';

// fs/promises is not available in node 12
// import fs from 'fs/promises';
import { default as fsWithCallbacks } from 'fs';
import del from 'del';
import { globby, globbySync } from 'globby';

import { jest, expect, beforeEach, test } from '@jest/globals';

const fs = fsWithCallbacks.promises;

jest.setTimeout(60_000);

beforeEach(async () => {
  await del(['./dist']);
});

function exists(glob) {
  let result = globbySync(glob, { expandDirectories: true });

  return result.length > 0;
}

async function build(env = {}) {
  await execa('ember', ['build', '--environment', 'production'], { env });
}

async function hasSourceMappingURL(glob, expectation) {
  let key = '//# sourceMappingURL';
  let files = await globby(glob, { expandDirectories: true });

  if (files.length === 0) {
    return false;
  }

  for (let file of files) {
    let data = await fs.readFile(file);

    if (!data.includes(key)) {
      if (expectation) {
        console.error(`${file} did not have content matching ${key}`);
      }
      return false;
    }
  }

  return true;
}

async function hasJSSourceMapsURL(expectation) {
  return await hasSourceMappingURL('dist/**/*.js', expectation);
}

test('basic build', async () => {
  await build();

  expect(exists('dist/**/*.map')).toBeFalsy();
  expect(await hasJSSourceMapsURL(false)).toBeFalsy();
});

test('build: sourceMap: external', async () => {
  await build({ SOURCEMAP: 'external' });

  expect(exists('dist/**/*.map')).toBeTruthy();
  expect(await hasJSSourceMapsURL(false)).toBeFalsy();
});

test('build: sourceMap: both', async () => {
  await build({ SOURCEMAP: 'both' });

  expect(exists('dist/**/*.map')).toBeTruthy();
  expect(await hasJSSourceMapsURL(true)).toBeTruthy();
});

test('build: sourceMap: inline', async () => {
  await build({ SOURCEMAP: 'inline' });

  expect(exists('dist/**/*.map')).toBeFalsy();
  expect(await hasJSSourceMapsURL(true)).toBeTruthy();
});
