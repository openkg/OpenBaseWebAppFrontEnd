// @param webpackConfig {Object} Webpack config provided by mcfe-react-scripts,
//        you can override some fields for small requirements.
//        See `mcfe-react-scripts/config/webpack.config.js` in `node_modules`
//        for the source codes of mcfe-react-scripts webpack config,
//        it's useful to know what you are overriding.
//        If you wanna do big hard override, you can copy those source codes
//        and modify them, return a new webpack config object,
//        but in this way, your webpack config will not benifit from the
//        upgrade of mcfe-react-scripts.
// @param options {Object} Extra config or utils, useful when copy and modify
//        source codes of mcfe-react-scripts webpack config.
exports.override = (webpackConfig, options) => {
  return webpackConfig
}
