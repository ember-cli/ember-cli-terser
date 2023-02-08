'use strict';

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    let addonOptions = app.options['ember-cli-terser'];

    if ('ember-cli-uglify' in app.options) {
      this.ui.writeWarnLine('[ember-cli-terser] Passing options as `ember-cli-uglify` in `ember-cli-build.js` is deprecated, please update to passing `ember-cli-terser` (with a `terser` property) instead.');

      addonOptions = Object.assign({}, app.options['ember-cli-uglify'], { terser: app.options['ember-cli-uglify'].uglify, uglify: undefined });
    }

    const { buildTerserOptions } = require('./lib/build-terser-options');

    this._terserOptions = buildTerserOptions({
      appEnv: app.env,
      appSourceMaps: app.options.sourcemaps,
      userOptions: addonOptions,
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
