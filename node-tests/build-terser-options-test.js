const { expect } = require('chai');
const { buildTerserOptions } = require('../lib/build-terser-options');
const { DEFAULT_OPTIONS } = require('../lib/default-options');

describe('build-terser-options', () => {
  it("returns the default options when no user options are provided", () => {
    let terserOptions = buildTerserOptions();

    expect(terserOptions).to.deep.equal({
      enabled: false,
      terser: DEFAULT_OPTIONS.terser,
    });
  });

  it("enables/disables terser based on the provided app env, but respecting the user's `enabled` option", () => {
    let terserOptions = buildTerserOptions();

    expect(terserOptions.enabled).to.be.false;

    terserOptions = buildTerserOptions({
      appEnv: 'development',
    });

    expect(terserOptions.enabled).to.be.false;

    terserOptions = buildTerserOptions({
      appEnv: 'production',
    });

    expect(terserOptions.enabled).to.be.true;

    terserOptions = buildTerserOptions({
      appEnv: 'development',
      userOptions: {
        enabled: true,
      },
    });

    expect(terserOptions.enabled).to.be.true;

    terserOptions = buildTerserOptions({
      appEnv: 'production',
      userOptions: {
        enabled: false,
      },
    });

    expect(terserOptions.enabled).to.be.false;
  });

  it('only uses the default `terser` options object if a custom `terser` options object is not provided', () => {
    let terserOptions = buildTerserOptions();

    expect(terserOptions.terser).to.equal(DEFAULT_OPTIONS.terser);
    expect(terserOptions.terser).to.deep.equal(DEFAULT_OPTIONS.terser);

    let customTerserOptionsObject = {
      foo: 'bar',
    };

    terserOptions = buildTerserOptions({
      userOptions: { terser: customTerserOptionsObject },
    });

    expect(terserOptions.terser).to.equal(customTerserOptionsObject);
    expect(terserOptions.terser).to.deep.equal(customTerserOptionsObject);
  });

  it("sets terser's `sourceMap` option to `false` based on the app's `sourcemaps` option, but respecting the user's `terser.sourceMap` option", () => {
    let terserOptions = buildTerserOptions();

    expect(terserOptions.terser.sourceMap).to.be.undefined;

    terserOptions = buildTerserOptions({
      appSourceMaps: true,
    });

    expect(terserOptions.terser.sourceMap).to.be.undefined;

    terserOptions = buildTerserOptions({
      appSourceMaps: false,
    });

    expect(terserOptions.terser.sourceMap).to.be.false;

    terserOptions = buildTerserOptions({
      appSourceMaps: {
        enabled: true,
        extensions: ['js'],
      },
    });

    expect(terserOptions.terser.sourceMap).to.be.undefined;

    terserOptions = buildTerserOptions({
      appSourceMaps: {
        enabled: true,
        extensions: ['css'],
      },
    });

    expect(terserOptions.terser.sourceMap).to.be.false;

    terserOptions = buildTerserOptions({
      appSourceMaps: {
        enabled: false,
      },
    });

    expect(terserOptions.terser.sourceMap).to.be.false;

    terserOptions = buildTerserOptions({
      appSourceMaps: {
        enabled: true,
      },
      userOptions: {
        terser: {
          sourceMap: false,
        },
      },
    });

    expect(terserOptions.terser.sourceMap).to.be.false;

    terserOptions = buildTerserOptions({
      appSourceMaps: {
        enabled: false,
      },
      userOptions: {
        terser: {
          sourceMap: true,
        },
      },
    });

    expect(terserOptions.terser.sourceMap).to.be.true;
  });
});
