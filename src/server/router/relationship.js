module.exports = {
  '/relationships': {
    method: 'get',
    handler: (req, res) => {
      res.jsonp([
        {
          order: 1,
          entity01: '刘欢',
          entity02: '教授',
          relationship: '职称',
          result: {
            wrong: 2,
            right: 1,
          },
        },
        {
          order: 2,
          entity01: '刘欢',
          entity02: 'https://cdn.chime.me/image/fs02/sitebuild/20180927/21/w640_original_941460427288841.jpeg',
          relationship: '学者照片',
          result: {
            wrong: 2,
            right: 1,
          },
        },
        {
          order: 3,
          entity01: '刘欢',
          entity02: 'Huan Liu',
          relationship: '学者姓名拼音',
          result: {
            wrong: 2,
            right: 1,
          },
        },
        {
          order: 4,
          entity01: '刘欢',
          entity02: '113.8177',
          relationship: '学者活跃度值',
          result: {
            wrong: 2,
            right: 1,
          },
        },
        {
          order: 5,
          entity01: '刘欢',
          entity02:
            '刘欢（Huan Liu），现为美国亚利桑那州立大学（Arizona State University）计算机科学与工程系的副教授。刘欢，1983年毕业于中国上海交通大学计算机科学与工程系并获学士学位。1985年从美国南加州大学（University of Southern California）获得计算机科学的硕士学位；1989年从南加大获得计算机科学的博士学位。其博士论文为Knowledge-Based Grasp Planning for Robot Hands”；博士导师为Dr. George A. Bekey。\n刘教授目前的研究方向为机器学习，数据挖掘，社区网络（SNS)等。',
          relationship: '学者档案',
          result: {
            wrong: 2,
            right: 1,
          },
        },
      ]);
    },
  },
};
