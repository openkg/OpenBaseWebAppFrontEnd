module.exports = {
  '/user/registe': {
    method: 'post',
    handler: (req, res) => {
      res.jsonp({
        code: 0,
        msg: '注册成功',
        token: 'aab326439f7afd8aae9954a9df8a6c6e',
      });
    },
  },
  '/user/login': {
    method: 'post',
    handler: (req, res) => {
      res.jsonp({
        code: 0,
        msg: '登录成功',
        token: 'aab326439f7afd8aae9954a9df8a6c6e',
      });
    },
  },
  '/user/detail': {
    method: 'get',
    handler: (req, res) => {
      res.jsonp({
        code: 0,
        msg: '登录成功',
        token: 'aab326439f7afd8aae9954a9df8a6c6e',
        data: {
          user_fullname: '杨帆玉1',
          user_email: '348991318@qq.com',
          user_mobile: '15671654377',
          user_organization: '清华大学',
          user_favourite: '人工智能',
          user_photo: 'https://cdn.chime.me/image/fs02/sitebuild/20180927/21/w640_original_941460427288841.jpeg',
          user_role: '4',
        },
      });
    },
  },
  '/user/detailUpdate': {
    method: 'post',
    handler: (req, res) => {
      res.jsonp({
        code: 0,
        msg: '修改成功',
        token: 'aab326439f7afd8aae9954a9df8a6c6e',
      });
    },
  },
  '/user/uploadPicture': {
    method: 'post',
    handler: (req, res) => {
      res.jsonp({
        code: 0,
        msg: '上传成功',
        token: 'aab326439f7afd8aae9954a9df8a6c6e',
        data: {
          uri: 'https://cdn.chime.me/image/fs02/sitebuild/20180927/21/w640_original_941460427288841.jpeg',
        },
      });
    },
  },
  '/user/logout/aab326439f7afd8aae9954a9df8a6c6e': {
    method: 'get',
    handler: (req, res) => {
      res.jsonp({
        code: 0,
        msg: '注销成功',
      });
    },
  },
};
