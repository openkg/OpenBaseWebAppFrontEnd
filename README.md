## openbase

基于 WIKIBASE 的开放众包理念，构建的中文领域知识图谱众包平台 - Openbase

### 项目结构：

```tree
├── public
├── src
│   ├── actions
│   ├── assets
│   └── components
│       ├── atlaslist
│       ├── baseinfo
│       └── common
│   ├── config
│   ├── container
│   ├── pages
│   ├── reducers
│   ├── sagas
│   ├── server
│   ├── services
│   ├── utils
│   ├── index.js
│   ├── index.css
│   ├── Routes.js
│   └── Store.js
├── .babelrc
├── package.json
├── README.md
└── webpack.override.js
```

- public：公共目录，存放 ico 图标、index.html 和 manifest.json 等文件
- src：项目代码目录
  - actions：action 目录
  - assets：静态资源目录
  - components：展示组件目录
  - container：容器组件目录
  - config：配置项目录，例如不同角色的导航栏菜单项
  - pages：页面文件目录
  - reducers：所有 reducer 文件目录
  - sagas：saga 目录
  - server：与后端服务相关，包括启动 json-server 服务和模拟的 api 接口
  - services：所有 ajax 请求相关
  - utils：公共模块目录
  - index.js：项目入口 js 文件，对应的样式文件为 index.css
  - Routes.js：react 路由配置
  - Store.js：redux 的 store 对象
- babelrc：babel 配置

### 项目运行

- 安装依赖

解压 node_modules.zip 到当前路径下

- 启动服务端

```
npm run server
```

- 启动项目

```
npm start
```

启动成功后，打开浏览器访问：http://localhost:3000/

- 修改代理
  将 package.json 里面的 proxy 修改成自己的服务地址即可
