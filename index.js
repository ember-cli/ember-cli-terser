'use strict';

module.exports = {
  name: 'ember-cli-uglify',

  included(app) {
    this._super.included.apply(this, arguments);

    const defaults = require('lodash.defaultsdeep');

    let defaultOptions = {
      enabled: app.env === 'production',

      terser: {
        compress: {
          // this is adversely affects heuristics for IIFE eval
          'negate_iife': false,
          // limit sequences because of memory issues during parsing
          sequences: 30,
        },
        mangle: {
          safari10: true
        },
        output: {
          // no difference in size and much easier to debug
          semicolons: false,
        },
      }
    };

    if (app.options.sourcemaps && !this._sourceMapsEnabled(app.options.sourcemaps)) {
      defaultOptions.terser.sourceMap = false;
    }

    let addonOptions = app.options['ember-cli-uglify'] || {};

    if ('uglify' in addonOptions) {
      this.ui.writeWarnLine('[ember-cli-uglify] Passing uglify in options is deprecated, please update to passing `terser` instead.');
      addonOptions = Object.assign({}, addonOptions, { terser: addonOptions.uglify, uglify: undefined });
    }

    this._terserOptions = defaults(addonOptions, defaultOptions);
  },

  _sourceMapsEnabled(options) {
    if (options.enabled === false) {
      return false;
    }

    let extensions = options.extensions || [];
    if (extensions.indexOf('js') === -1) {
      return false;
    }

    return true;
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
