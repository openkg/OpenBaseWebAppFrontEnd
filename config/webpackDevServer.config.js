'use strict'

const errorOverlayMiddleware = require('@mi/mcfe-react-error-overlay/middleware')
const noopServiceWorkerMiddleware = require('@mi/mcfe-react-dev-utils/noopServiceWorkerMiddleware')
const paths = require('./paths')
const url = require('url')

module.exports = function(config, proxy, allowedHost, protocol, host, port) {
  const { homepage } = require(paths.appPackageJson)
  const { PUBLIC_URL } = process.env
  let homepageHost = undefined
  let homepageReg = undefined
  // 跟 index.html 在同一个目录下服务出来的其它 meta 文件
  let metaFilesReg = undefined
  if (homepage || PUBLIC_URL) {
    const homepageUrlObject = url.parse(homepage || PUBLIC_URL, false, true)
    homepageHost = homepageUrlObject.host || undefined
    // `homepageDir` can be `null`, otherwise must starts with `/`,
    // `url.parse('//aaa.com', false, true).pathname` => `null`
    let homepageDir = homepageUrlObject.pathname
    if (homepageDir) {
      if (/.*\/index\.html?$/.test(homepageDir)) {
        //  because `url.resolve('/aaa/bbb/index.html', '.')` => '/aaa/bbb/'
        homepageDir = url.resolve(homepageDir, '.')
      }
      homepageDir = paths.ensureSlash(homepageDir, false)
      homepageReg = new RegExp(`^${homepageDir}(?:/index\.html)?$`)
      metaFilesReg = new RegExp(
        `^${homepageDir}/(favicon\.ico|manifest\.json)?$`, 'i'
      )
    }
  }

  let publicHost, publicBasePath
  if (paths.publicUrl) {
    // If specify homepage by ip and port,
    // but not specify `PUBLIC_URL`,
    // `paths.publicUrl` got ip and port.
    // `host` returned by `url.parse()` includes port, refer:
    // https://nodejs.org/api/url.html#url_urlobject_host
    const { host, pathname } = url.parse(paths.publicUrl, true, true)
    if (host) {
      publicHost = host
    }
    publicBasePath = pathname
  }

  proxy = proxy || []
  const proxyCommonConfig = {
    logLevel: process.env.HPM_LOG_LEVEL || 'debug',
    changeOrigin: true,
    xfwd: true,
  }
  const localhostTarget = `${protocol}://localhost:${port}`
  proxy.unshift(
    // Proxy index.html and the meta files that are accessed by `homepage`
    Object.assign({
      context: (pathname, req) => {
        return req.method === 'GET'
          // `req.hostname` or `req.host` may not contain port at some cases,
          // but `req.headers.host` contain port if exist.
          // And `homepageHost` can contain port,
          // so use `req.headers.host` instead of `req.hostname` or `req.host`.
          && (homepageHost && req.headers.host.indexOf(homepageHost) >= 0)
          && (
            (homepageReg && homepageReg.test(req.path)) ||
            (metaFilesReg && metaFilesReg.test(req.path))
          )
      },
      target: localhostTarget,
      pathRewrite: (reqUrl, req) => {
        // `devServerConfig.publicPath` may contain protocol and host
        const matchedMetaFile = (req.path.match(metaFilesReg) || [])[1]
        return url.resolve('/', matchedMetaFile || 'index.html')
      },
    }, proxyCommonConfig),
    // Proxy public files that are accessed by `PUBLIC_URL`
    Object.assign({
      context: (pathname, req) => {
        return req.method === 'GET'
          && (publicHost && req.headers.host.indexOf(publicHost) >= 0)
          && (publicBasePath && req.path.indexOf(publicBasePath) === 0)
          // If not specify PUBLIC_URL, there is no way to distinguish public
          // files request from AJAX request, but if a GET request has query
          // params, it probably is AJAX request. This solution is based on
          // that webpack would not generate a URL having query params for
          // public files.
          && (PUBLIC_URL || !Object.keys(req.query).length)
      },
      target: localhostTarget,
      pathRewrite: (reqUrl, req) => {
        return url.resolve('/', req.path.slice(publicBasePath.length))
      },
    }, proxyCommonConfig)
  )
  proxy.push(
    Object.assign({
      context: (pathname, req) => req.headers.host.indexOf(`localhost:${port}`) < 0,
      // Must have a target, otherwise webpack-dev-server will not use
      // the proxy config object.
      target: '<online>',
      // Specify target according to request.
      router: req => {
        const { protocol, host } = url.parse(req.url)
        return `${protocol}//${host}`
      },
      onProxyRes:
        process.env.ADD_CORS ?
        (proxyRes, req) => {
          const { origin } = req.headers
          if (origin && origin.indexOf(publicHost) >= 0) {
            proxyRes.headers['Access-Control-Allow-Origin'] = origin
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true'
          }
        } :
        undefined,
    }, proxyCommonConfig)
  )

  const devServerConfig = {
    // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
    // websites from potentially accessing local content through DNS rebinding:
    // https://github.com/webpack/webpack-dev-server/issues/887
    // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
    // However, it made several existing use cases such as development in cloud
    // environment or subdomains in development significantly more complicated:
    // https://github.com/facebookincubator/create-react-app/issues/2271
    // https://github.com/facebookincubator/create-react-app/issues/2233
    // While we're investigating better solutions, for now we will take a
    // compromise. Since our WDS configuration only serves files in the `public`
    // folder we won't consider accessing them a vulnerability. However, if you
    // use the `proxy` feature, it gets more dangerous because it can expose
    // remote code execution vulnerabilities in backends like Django and Rails.
    // So we will disable the host check normally, but enable it if you have
    // specified the `proxy` setting. Finally, we let you override it if you
    // really know what you're doing with a special environment variable.
    disableHostCheck: !proxy ||
      process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    // Enable gzip compression of generated files.
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',
    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through Webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    contentBase: paths.appPublic,
    // By default files from `contentBase` will not trigger a page reload.
    watchContentBase: true,
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: '/',
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.plugin` calls above.
    quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/,
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    host,
    overlay: false,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
    },
    public: allowedHost,
    proxy,
    setup(app) {
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware())
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware())
    },
  }

  return devServerConfig
}
