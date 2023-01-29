const DEFAULT_OPTIONS = {
  terser: {
    compress: {
      negate_iife: false, // This adversely affects heuristics for IIFE eval.
      sequences: 30, // Limit sequences because of memory issues during parsing.
    },
    mangle: {
      safari10: true,
    },
    output: {
      semicolons: false, // No difference in size, and much easier to debug.
    },
  },
};

module.exports = { DEFAULT_OPTIONS };
