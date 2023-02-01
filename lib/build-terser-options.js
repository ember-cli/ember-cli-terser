const { DEFAULT_OPTIONS } = require('./default-options');

function buildTerserOptions({ appEnv, appSourceMaps, userOptions } = {}) {
  let terserOptions = {
    enabled: appEnv === 'production',
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  if (
    'sourceMap' in terserOptions.terser === false &&
    sourceMapsEnabled(appSourceMaps) === false
  ) {
    terserOptions.terser = {
      ...terserOptions.terser,
      sourceMap: false,
    };
  }

  return terserOptions;
}

function sourceMapsEnabled(appSourceMaps) {
  if (typeof appSourceMaps === 'undefined') {
    return true;
  }

  if (typeof appSourceMaps === 'boolean') {
    return appSourceMaps;
  }

  if (appSourceMaps.enabled === false) {
    return false;
  }

  if ((appSourceMaps.extensions || []).includes('js') === false) {
    return false;
  }

  return true;
}

module.exports = { buildTerserOptions };
