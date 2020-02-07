const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const proxyMap = {};
const proxy = { target: 'http://localhost:9000', secure: false };

function handlerRouter(server, routerFile) {
  const routers = require(routerFile);

  Object.keys(routers).forEach(name => {
    const path = (name.charAt(0) === '/' ? '' : '/') + name;
    const item = routers[name];
    const method = item.method || 'get';
    const router = item.handler;

    proxyMap[path] = proxy;
    server[method](path, router);
  });
}

function mergeRouter(server, dir) {
  const files = fs.readdirSync(dir);
  for (let i = 0, len = files.length; i < len; i += 1) {
    handlerRouter(server, dir + files[i]);
  }
}

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);
mergeRouter(server, `${path.resolve(__dirname, './router/')}/`);

server.use(jsonServer.bodyParser);

server.listen(9000, () => {
  console.log('JSON Server is running at http://localhost:9000/.');
});

module.exports = proxyMap;
