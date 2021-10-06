'use strict';

const debug = require('debug')('ember-cli-esbuild');
const defaults = require('lodash.defaultsdeep');
const fs = require('fs');
const esbuild = require('esbuild');

module.exports = async function processFile(inFile, outFile, relativePath, outDir, silent, _options) {
  let src = fs.readFileSync(inFile, 'utf-8');
  let options = defaults({}, _options.esbuild);
  let start = new Date();
  debug('[starting]: %s %dKB', relativePath, (src.length / 1000));

  try {
    let result = await esbuild.build({
      entryPoints: [src],
      sourcemap: sourceMap,
      bundle: false,
      minify: true,
      outfile: outFile,
    });

    let end = new Date();
    let total = end - start;

    if (total > 20000 && !silent) {
      console.warn(`[WARN] (ember-cli-esbuild) Minifying "${relativePath}" took: ${total}ms (more than 20,000ms)`);
    }

    debug('[finished]: %s %dKB in %dms', relativePath, (result.code.length / 1000), total);
  } catch (e) {
    e.filename = relativePath;
    throw e;
  }
};
