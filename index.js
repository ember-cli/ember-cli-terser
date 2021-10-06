'use strict';

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    let defaultOptions = {
      enabled: app.env === 'production',

      esbuild: {}
    };

    if (app.options.sourcemaps && !areSourceMapsEnabled(app.options.sourcemaps)) {
      defaultOptions.esbuild.sourceMap = false;
    }

    let addonOptions = app.options['ember-cli-esbuild'];

    this._esbuildOptions = Object.assign({}, defaultOptions, addonOptions);
  },

  postprocessTree(type, tree) {
    if (this._esbuildOptions.enabled === true && type === 'all') {
      const ESBuildPlugin = require('./lib');

      return new ESBuildPlugin(tree, this._esbuildOptions);
    } else {
      return tree;
    }
  }
};

function areSourceMapsEnabled(options) {
  if (options.enabled === false) {
    return false;
  }

  let extensions = options.extensions || [];
  if (extensions.indexOf('js') === -1) {
    return false;
  }

  return true;

}
