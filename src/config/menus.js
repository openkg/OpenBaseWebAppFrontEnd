const baseinfo = {
  path: '/index/userinfo',
  title: '个人信息',
};
const search = {
  path: '/index/search',
  title: '图谱搜索',
};
const download = {
  path: '/index/download',
  title: '图谱下载',
};
const atlaslist = {
  path: '',
  title: '浏览图谱',
  className: 'empty',
  subitems: [
    {
      path: '/index/atlaslist',
      title: 'KG4AI',
    },
  ],
};
const check = {
  path: '',
  title: '验收图谱',
  className: 'empty',
  subitems: [
    {
      path: '/index/checksumary',
      title: 'KG4AI',
    },
  ],
};
const audit = {
  path: '',
  title: '审核图谱',
  className: 'empty',
  subitems: [
    {
      path: '/index/auditsumary/kg4ai',
      title: 'KG4AI',
    },
    {
      path: '/index/auditsumary/agriculture',
      title: '农业知识图谱',
    },
    {
      path: '/index/auditsumary/people',
      title: '百科人物知识图谱',
    },
    {
      path: '/index/auditsumary/buddism',
      title: '佛学知识图谱',
    },
  ],
};
const users = {
  path: '/index/users',
  title: '人员管理',
};
// 4：游客；3：验收员；2：审核员；1：超级管理员；0：未登录
const roleMenus = {
  5: [search, download, atlaslist, check],
  4: [baseinfo, search, download, atlaslist, audit, check],
  3: [baseinfo, search, download, atlaslist, check, audit],
  2: [baseinfo, search, download, atlaslist, audit, check],
  1: [baseinfo, search, download, atlaslist, audit, check, users],
};
const getMenus = roles => {
  const menus = [];
  if (!Array.isArray(roles)) {
    roles = roles.split(',');
  }
  roles.forEach(role => {
    const items = roleMenus[role];
    items.forEach(item => {
      const exist = menus.findIndex(menu => menu.title === item.title) > -1;
      if (!exist) {
        menus.push(item);
      }
    });
  });

  return menus;
};

export default roleMenus;
export { getMenus };
