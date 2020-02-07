let visittedCount = 0;
const info = {
  name: 'ZHAOHUI Wu',
  pubNumber: 606,
  nameZH: '吴朝晖',
  email: 'wzh@zju.edu.cn',
  citationCount: 7402,
  hindex: 45,
  gender: 'male',
  activity: '154.4927',
  affiliation: '浙江大学计算机科学与技术学院',
  jobTitle: '教授、博导',
  picture: 'https://cdn.chime.me/image/fs02/sitebuild/20180927/21/w640_original_941460427288841.jpeg',
  bio:
    '吴朝晖，男，汉族，1966年12月出生，浙江温州人，1995年6月加入中国共产党，1993年10月参加工作，浙江大学计算机应用专业毕业，研究生学历、博士，浙江大学计算机科学与技术学院教授、博士生导师。中国科学院院士。',
  website: 'http://baike.baidu.com/link?url=6gKfArTxMp5KO92RTP5edmcoIXQAIWYf8mjDA4VC0wMPJxjwN2pJg6_2lomm-BcIgZAtPFcbUDeuA9pNF2wJqK',
};

module.exports = {
  '/atlaslist/*': {
    method: 'get',
    handler: (req, res) => {
      visittedCount += 1;
      res.jsonp({
        code: 200,
        data: Object.assign(info, {
          nameZH: `吴朝晖${visittedCount}`,
          preId: visittedCount - 1,
          nextId: visittedCount + 1,
        }),
      });
    },
  },
};
