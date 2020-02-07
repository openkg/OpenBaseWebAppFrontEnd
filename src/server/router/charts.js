let i = 0;
module.exports = {
  'knowledges/collections': {
    method: 'post',
    handler: (req, res) => {
      i += 1;
      res.jsonp({
        code: 0,
        msg: '成功',
        data: {
          name: `杨帆玉${i}`,
          skills: [
            '数据挖掘',
            '服务发现',
            '操作系统',
            '图像识别与理解',
            '本体论',
            '普通计算',
            '人脸识别',
            '面向服务架构',
            '语义网',
            '中间件',
            '人工智能',
            'web服务',
          ],
          skilledProfessionals: [
            {
              name: '杜啊1',
              id: 1231,
            },
            {
              name: '胡是2',
              id: 1232,
            },
            {
              name: '王小3',
              id: 1233,
            },
            {
              name: '杜勇4',
              id: 1234,
            },
            {
              name: '杜勇5',
              id: 1235,
            },
            {
              name: '杜勇6',
              id: 1236,
            },
            {
              name: '杜勇7',
              id: 1237,
            },
            {
              name: '杜勇8',
              id: 1238,
            },
            {
              name: '杜2勇',
              id: 1239,
            },
            {
              name: '杜23勇',
              id: 1221,
            },
            {
              name: '杜4勇',
              id: 1222,
            },
          ],
          skillsCount: 50,
          professionalsCount: 100,
        },
      });
    },
  },
  '/pushMessage': {
    method: 'post',
    handler: (req, res) => {
      const triggrtText = '哈哈';
      let allData = '';
      req.on('data', chunk => {
        allData += chunk;
      });
      req.on('end', () => {
        allData = JSON.parse(allData);
        const isTrigger = allData.content.indexOf(triggrtText) > -1;
        res.jsonp({
          code: 0,
          msg: '成功',
          data: Object.assign(
            {},
            {
              content: allData.content,
              date: Date.now(),
            },
            isTrigger ? { freshProfessionId: 12345 } : {}
          ),
        });
      });
    },
  },
};
