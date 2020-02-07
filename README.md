## openbase
基于WIKIBASE的开放众包理念，构建的中文领域知识图谱众包平台 - Openbase

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
- public：公共目录，存放ico图标、index.html和manifest.json等文件
- src：项目代码目录
  - actions：action目录
  - assets：静态资源目录
  - components：展示组件目录
  - container：容器组件目录
  - config：配置项目录，例如不同角色的导航栏菜单项
  - pages：页面文件目录
  - reducers：所有reducer文件目录
  - sagas：saga目录
  - server：与后端服务相关，包括启动json-server服务和模拟的api接口
  - services：所有ajax请求相关
  - utils：公共模块目录
  - index.js：项目入口js文件，对应的样式文件为index.css
  - Routes.js：react路由配置
  - Store.js：redux的store对象
- babelrc：babel配置

### 项目运行
- 安装依赖
```
npm install
```
- 启动服务端
```
npm run server
```
- 启动项目
```
npm start
```
启动成功后，打开浏览器访问：http://localhost:3000/


