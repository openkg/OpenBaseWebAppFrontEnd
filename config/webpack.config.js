'use strict'

/* eslint comma-dangle: "off" */
/* eslint strict: "off" */

const getClientEnvironment = require('./env')
const path = require('path')
const paths = require('./paths')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')

let override

try {
  override = require(path.join(paths.appPath, 'webpack.override.js')).override
}
catch (error) {
  // do nothing, just for old apps without `webpack.override.js` file
}

const {
  NODE_ENV,
  DEVTOOL,
  PUBLIC_URL,
  EXTRACT_TEXT_WEBPACK_PLUGIN_ALL_CHUNKS,
  WRITE_OUTPUT_FILES,
  GENERATE_CSS_SOURCE_MAP,
} = process.env
const isProd = NODE_ENV === 'production'
// Get environment variables to inject into our app.
const env = getClientEnvironment(
  isProd ?
    // provide it to our app as %PUBLIC_URL% in `index.html`
    // and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_URL%/xyz looks better than
    // %PUBLIC_URL%xyz.
    paths.ensureSlash(paths.servedPath, false) :
    ''
)

const webpackConfig = {
  // Don't attempt to continue if there are any errors.
  bail: isProd,
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: DEVTOOL ||
    (isProd ? 'source-map' : 'cheap-module-source-map'),
  entry: {
    main:
      isProd ?
        // In production, we only want to load the polyfills and the app code.
        [require.resolve('./polyfills'), paths.appIndexJs] :
        [
          // Include an alternative client for WebpackDevServer. A client's job is to
          // connect to WebpackDevServer by a socket and get notified about changes.
          // When you save a file, the client will either apply hot updates (in case
          // of CSS changes), or refresh the page (in case of JS changes). When you
          // make a syntax error, this client will display a syntax error overlay.
          // Note: instead of the default WebpackDevServer client, we use a custom one
          // to bring better experience for Create React App users. You can replace
          // the line below with these two lines if you prefer the stock client:
          // require.resolve('webpack-dev-server/client') + '?/',
          // require.resolve('webpack/hot/dev-server'),
          require.resolve('@mi/mcfe-react-dev-utils/webpackHotDevClient'),
          // We ship a few polyfills by default:
          require.resolve('./polyfills'),
          // Errors should be considered fatal in development
          require.resolve('@mi/mcfe-react-error-overlay'),
          // Finally, this is your app's code:
          paths.appIndexJs,
          // We include the app code last so that if there is a runtime error during
          // initialization, it doesn't blow up the WebpackDevServer client, and
          // changing JS code would still trigger a refresh.
        ],
  },
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it,
    // so always provide it.
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: !isProd,
    filename: isProd ? '[name].[chunkhash:8].js' : '[name].js',
    chunkFilename: isProd ? '[name].[chunkhash:8].chunk.js' : '[name].chunk.js',
    // It requires a trailing slash, or the file assets will get an incorrect path.
    publicPath:
      isProd ?
        paths.servedPath :
        // On development environment,
        // mock production environment as far as possible,
        // so use PUBLIC_URL if exist.
        // Use a '/' instead '.' as default,
        // because it's easier to serve public files on development env.
        (PUBLIC_URL ? paths.ensureSlash(PUBLIC_URL, true) : '/'),
    // Point sourcemap entries to original disk location
    devtoolModuleFilenameTemplate:
      isProd ?
        info => path.relative(paths.appSrc, info.absoluteResourcePath) :
        info => path.resolve(info.absoluteResourcePath),
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      // Resolve Babel runtime relative to react-scripts.
      // It usually still works on npm 3 without this but it would be
      // unfortunate to rely on, as react-scripts could be symlinked,
      // and thus babel-runtime might not be resolvable from the source.
      'babel-runtime': path.dirname(
        require.resolve('babel-runtime/package.json')
      ),
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new (require('@mi/mcfe-react-dev-utils/ModuleScopePlugin'))(paths.appSrc),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // TODO: Disable require.ensure as it's not a standard language feature.
      // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
      // { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: require('@mi/mcfe-react-dev-utils/eslintFormatter'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      // ** ADDING/UPDATING LOADERS **
      // The "file" loader handles all assets unless explicitly excluded.
      // The `exclude` list *must* be updated with every change to loader extensions.
      // When adding a new loader, you must add its `test`
      // as a new entry in the `exclude` list in the "file" loader.

      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.less$/,
          /\.scss$/,
          /\.sass$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: '[name].[hash:8].[ext]',
        },
      },
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: '[name].[hash:8].[ext]',
        },
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: [paths.appSrc],
        loader: require.resolve('babel-loader'),
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: !isProd,
        },
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      ...[
        { include: paths.appNodeModules },
        { include: paths.appSrc },
      ].map(rule => {
        rule.test = /\.css$/
        const cssLoaderBaseOptions = {
          importLoaders: 1,
          minimize: isProd,
          sourceMap: GENERATE_CSS_SOURCE_MAP === 'true',
        }
        const cssLoaderOptionsForCssModule = {
          modules: true,
          localIdentName: '[local]-[hash:base64:5]',
          camelCase: true,
        }


        const loaders = [
          {
            loader: require.resolve('css-loader'),
            // enable css module only for css files in app src directory
            options: rule.include === paths.appSrc ?
              Object.assign(
                {},
                cssLoaderBaseOptions,
                cssLoaderOptionsForCssModule
              ) :
              cssLoaderBaseOptions,
          },
          // Donot config postcss here,
          // use postcss config file instead.
          // https://github.com/michael-ciniawsky/postcss-load-config
          require.resolve('postcss-loader'),
        ]
        rule.use = isProd ?
          ExtractTextPlugin.extract({
            fallback: require.resolve('style-loader'),
            use: loaders,
          }) :
          [require.resolve('style-loader')].concat(loaders)
        return rule
      }),
      ...[
        { include: paths.appNodeModules },
        { include: paths.appSrc },
      ].map(rule => {
        rule.test = /\.scss$/
        const cssLoaderBaseOptions = {
          importLoaders: 1,
          minimize: isProd,
          sourceMap: GENERATE_CSS_SOURCE_MAP === 'true',
        }
        const cssLoaderOptionsForCssModule = {
          modules: true,
          localIdentName: '[local]-[hash:base64:5]',
          camelCase: true,
        }


        const loaders = [
          {
            loader: require.resolve('css-loader'),
            // enable css module only for css files in app src directory
            options: rule.include === paths.appSrc ?
              Object.assign(
                {},
                cssLoaderBaseOptions,
                cssLoaderOptionsForCssModule
              ) :
              cssLoaderBaseOptions,
          },
          // Donot config postcss here,
          // use postcss config file instead.
          // https://github.com/michael-ciniawsky/postcss-load-config
          require.resolve('postcss-loader'),
          require.resolve('sass-loader')
        ]
        rule.use = isProd ?
          ExtractTextPlugin.extract({
            fallback: require.resolve('style-loader'),
            use: loaders,
          }) :
          [require.resolve('style-loader')].concat(loaders)
        return rule
      })
      // ** STOP ** Are you adding a new loader?
      // Remember to add the new extension(s) to the "file" loader exclusion list.
    ],
  },
  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new (require('@mi/mcfe-react-dev-utils/InterpolateHtmlPlugin'))(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new (require('html-webpack-plugin'))({
      inject: true,
      template: process.env.PUBLISH_ENV === 'dev' ? paths.appHtml : paths.appFormalHtml,
      minify:
        isProd ?
          {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          } :
          undefined,
    }),
    // Makes some environment variables available to the JS code, for example:
    // `if (process.env.NODE_ENV === 'production') { ... }`
    // or
    // `if (process.env.NODE_ENV === 'development') { ... }`
    // See `./env.js` for more detail.
    // It is absolutely essential that `NODE_ENV` was set to `'production'`
    // for production environment,
    // otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
    .concat(isProd ?
      [
        // Minify the code.
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebookincubator/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
          },
          output: {
            comments: false,
          },
          sourceMap: true,
        }),
        // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
        new ExtractTextPlugin({
          filename: '[name].[contenthash:8].css',
          allChunks: EXTRACT_TEXT_WEBPACK_PLUGIN_ALL_CHUNKS === 'true',
        }),
        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        new (require('webpack-manifest-plugin'))({
          fileName: 'asset-manifest.json',
        }),
        // Generate a service worker script that will precache, and keep up to date,
        // the HTML & assets that are part of the Webpack build.
        new (require('sw-precache-webpack-plugin'))({
          // By default, a cache-busting query parameter is appended to requests
          // used to populate the caches, to ensure the responses are fresh.
          // If a URL is already hashed by Webpack, then there is no concern
          // about it being stale, and the cache-busting can be skipped.
          dontCacheBustUrlsMatching: /\.\w{8}\./,
          filename: 'service-worker.js',
          logger(message) {
            if (message.indexOf('Total precache size is') === 0) {
              // This message occurs for every build and is a bit too noisy.
              return
            }
            console.log(message)
          },
          minify: true,
          // For unknown URLs, fallback to the index page
          navigateFallback: `${paths.servedPath}index.html`,
          // Ignores URLs starting from /__ (useful for Firebase):
          // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
          navigateFallbackWhitelist: [/^(?!\/__).*/],
          // Don't precache sourcemaps (they're large) and build asset manifest:
          staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
          // Work around Windows path issue in SWPrecacheWebpackPlugin:
          // https://github.com/facebookincubator/create-react-app/issues/2235
          stripPrefix: `${paths.appBuild.replace(/\\/g, '/')}/`,
        }),
      ] :
      [
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new (require('case-sensitive-paths-webpack-plugin'))(),
        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebookincubator/create-react-app/issues/186
        new (require('@mi/mcfe-react-dev-utils/WatchMissingNodeModulesPlugin'))(
          paths.appNodeModules
        ),
      ]),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: isProd ? undefined : {
    hints: false,
  },
}

if (!isProd && WRITE_OUTPUT_FILES === 'true') {
  webpackConfig.plugins.unshift(
    new CleanPlugin(
      [path.resolve(webpackConfig.output.path)],
      {
        // Absolute path to your webpack root folder
        root: paths.appPath,
      }
    )
  )
  webpackConfig.plugins.push(
    new WriteFilePlugin({ force: true })
  )
}

module.exports = !override ? webpackConfig : override(webpackConfig, {
  getClientEnvironment,
  paths,
})
