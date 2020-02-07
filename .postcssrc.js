// For more detail about autoloading config for PostCSS:
// https://github.com/michael-ciniawsky/postcss-load-config
// @param {Object} ctx https://github.com/postcss/postcss-loader#context-ctx
module.exports = ctx => {
  const { env, file, options } = ctx
  return {
    map: env === 'production' ? false : 'inline',
    plugins: [
      require('postcss-flexbugs-fixes')(),
      // For all features provided by cssnext:
      // http://cssnext.io/features/
      require('postcss-cssnext')({
        // How to custom cssnext features:
        // http://cssnext.io/usage/#features
      }),
    ],
  }
}
