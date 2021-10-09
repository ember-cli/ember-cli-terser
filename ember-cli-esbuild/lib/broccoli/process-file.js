// Originally from
// https://github.com/ember-cli/broccoli-terser-sourcemap/blob/master/lib/process-file.js
'use strict';

const fs = require('fs').promises;
const debug = require('debug')('ember-cli-esbuild');
const defaults = require('lodash.defaultsdeep');
const esbuild = require('esbuild');

module.exports = async function processFile(
  inFile,
  outFile,
  relativePath,
  outDir,
  silent,
  _options
) {
  let src = await fs.readFile(inFile, 'utf-8');
  let options = defaults({}, _options);
  let start = new Date();

  debug('[starting]: %s %dKB', relativePath, src.length / 1000);

  try {
    await esbuild.build({
      entryPoints: [inFile],
      sourcemap: options.sourceMap ?? false,
      // bundling happens externally (broccoli, webpack, etc)
      bundle: false,
      minify: true,
      outfile: outFile,
    });

    let end = new Date();
    let total = end - start;

    if (total > 20000 && !silent) {
      console.warn(
        `[WARN] (ember-cli-esbuild) Minifying "${relativePath}" took: ${total}ms (more than 20,000ms)`
      );
    }

    let outCode = await fs.readFile(outFile, 'utf-8');

    debug('[finished]: %s %dKB in %dms', relativePath, outCode.length / 1000, total);
  } catch (e) {
    e.filename = relativePath;
    throw e;
  }
};
