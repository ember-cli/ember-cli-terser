'use strict';

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    const { buildTerserOptions } = require('./lib/build-terser-options');

    this._terserOptions = buildTerserOptions({
      appEnv: app.env,
      appSourceMaps: app.options.sourcemaps,
      userOptions: app.options['ember-cli-terser'],
    });
  },

  postprocessTree(type, tree) {
    if (this._terserOptions.enabled === true && type === 'all') {
      const Terser = require('broccoli-terser-sourcemap');

      return new Terser(tree, this._terserOptions);
    } else {
      return tree;
    }
  }
};
