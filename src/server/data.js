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
const initAuditTasks = count => {
  const array = [];
  for (let i = 0; i < count; i += 1) {
    array.push({
      subjectId: 'http://xxx.com/subject/刘欢',
      subject: `刘欢${i}`,
      sumary:
        '刘欢（Huan Liu），现为美国亚利桑那州立大学（Arizona State University）计算机科学与工程系的副教授。刘欢，1983年毕业于中国上海交通大学计算机科学......',
      reviewedRes: 0,
      triples: [
        {
          tripleId: 1233,
          subject: '刘欢',
          property: '职称',
          object: '教授',
          reviewedRes: 0,
        },
        {
          tripleId: 1234,
          subject: '刘欢',
          property: '学者照片',
          object: 'https://cdn.chime.me/image/fs02/sitebuild/20180927/21/w640_original_941460427288841.jpeg',
          reviewedRes: 0,
        },
        {
          tripleId: 1235,
          subject: '刘欢',
          property: '学者姓名拼音',
          object: 'Huan Liu',
          reviewedRes: 0,
        },
        {
          tripleId: 1236,
          subject: '刘欢',
          property: '学者活跃度值',
          object: '113.8177',
          reviewedRes: 0,
        },
        {
          tripleId: 1237,
          subject: '刘欢',
          property: '学者档案',
          object:
            '刘欢（Huan Liu），现为美国亚利桑那州立大学（Arizona State University）计算机科学与工程系的副教授。刘欢，1983年毕业于中国上海交通大学计算机科学与工程系并获学士学位。1985年从美国南加州大学（University of Southern California）获得计算机科学的硕士学位；1989年从南加大获得计算机科学的博士学位。其博士论文为Knowledge-Based Grasp Planning for Robot Hands”；博士导师为Dr. George A. Bekey。\n刘教授目前的研究方向为机器学习，数据挖掘，社区网络（SNS)等。',
          reviewedRes: 0,
        },
      ],
    });
  }
  return array;
};
const initCheckTasks = count => {
  const array = [];
  for (let i = 0; i < count; i += 1) {
    array.push({
      subjectId: 'http://xxx.com/subject/刘欢',
      subject: `刘欢${i}`,
      reviewedRes: '认为正确：1人，认为错误：2人',
      sumary:
        '刘欢（Huan Liu），现为美国亚利桑那州立大学（Arizona State University）计算机科学与工程系的副教授。刘欢，1983年毕业于中国上海交通大学计算机科学......',
      acceptanceRes: 0,
      triples: [
        {
          tripleId: 1233,
          subject: '刘欢',
          property: '职称',
          object: '教授',
          reviewedRes: '认为正确：1人，认为错误：2人',
          acceptanceRes: 0,
        },
        {
          tripleId: 1234,
          subject: '刘欢',
          property: '学者照片',
          object: 'https://cdn.chime.me/image/fs02/sitebuild/20180927/21/w640_original_941460427288841.jpeg',
          reviewedRes: '认为正确：1人，认为错误：2人',
          acceptanceRes: 0,
        },
        {
          tripleId: 1235,
          subject: '刘欢',
          property: '学者姓名拼音',
          object: 'Huan Liu',
          reviewedRes: '认为正确：1人，认为错误：2人',
          acceptanceRes: 0,
        },
        {
          tripleId: 1236,
          subject: '刘欢',
          property: '学者活跃度值',
          object: '113.8177',
          reviewedRes: '认为正确：1人，认为错误：2人',
          acceptanceRes: 0,
        },
        {
          tripleId: 1237,
          subject: '刘欢',
          property: '学者档案',
          object:
            '刘欢（Huan Liu），现为美国亚利桑那州立大学（Arizona State University）计算机科学与工程系的副教授。刘欢，1983年毕业于中国上海交通大学计算机科学与工程系并获学士学位。1985年从美国南加州大学（University of Southern California）获得计算机科学的硕士学位；1989年从南加大获得计算机科学的博士学位。其博士论文为Knowledge-Based Grasp Planning for Robot Hands”；博士导师为Dr. George A. Bekey。\n刘教授目前的研究方向为机器学习，数据挖掘，社区网络（SNS)等。',
          reviewedRes: '认为正确：1人，认为错误：2人',
          acceptanceRes: 0,
        },
      ],
    });
  }
  return array;
};
let visittedCount = 0;
const data = {
  '/relationships': [
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
  ],
  '/entities': [
    {
      order: 1,
      name: '刘欢',
      property:
        '刘欢（Huan Liu），现为美国亚利桑那州立大学（Arizona State University）计算机科学与工程系的副教授。刘欢，1983年毕业于中国上海交通大学计算机科学......',
      result: {
        wrong: 2,
        right: 1,
      },
    },
    {
      order: 2,
      name: '张长水',
      property:
        '张长水，男，1965年生，河北人。智能技术与系统国家重点实验室学术委员会委员，清华大学自动化系教授、博士生导师智能技术与系统国家重点实验室副......',
      result: {
        wrong: 2,
        right: 1,
      },
    },
    {
      order: 3,
      name: '梅宏',
      property:
        '梅宏，男，1963年5月生，汉族，籍贯重庆，出生并成长于贵州。1984和1987年分别于南京航空学院获学士和硕士学位1992年于上海交通大学获博士学位，1994......',
      result: {
        wrong: 2,
        right: 1,
      },
    },
    {
      order: 4,
      name: '黄庆明',
      property:
        '黄庆明：男，博士，教授，国家杰出青年基金获得者。1984至1994年在哈尔滨工业大学获学士硕士和博士学, 1996年在新加坡国立大学工学院 从事博士后研究......',
      result: {
        wrong: 2,
        right: 1,
      },
    },
    {
      order: 5,
      name: '胡事民',
      property:
        '胡事民，清华大学计算机系副主任、学位分委员会主席。教育部长江学者特聘教授。1968年生于浙江长兴。1986年考入吉林数学系；1990年免试进入浙江大学......',
      result: {
        wrong: 2,
        right: 1,
      },
    },
    {
      order: 6,
      name: '戴琼海',
      property:
        '戴琼海，1964年12月26日生，1996年博士毕业，清华大学自动化系教授、博导、宽带网数字媒体实验室主任。主要研究领域为视频处理及宽带通信......',
      result: {
        wrong: 2,
        right: 1,
      },
    },
  ],
  '/knowledges/collections': {
    code: 0,
    msg: '成功',
    data: {
      name: '杨帆玉1',
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
  },
  '/atlaslist/*': {
    code: 0,
    data: Object.assign(info, {
      nameZH: `吴朝晖${(visittedCount += 1)}`,
      preId: visittedCount - 1,
      nextId: visittedCount + 1,
    }),
  },
  '/users': [
    {
      id: '1',
      fullname: '游客',
      mobile: '18513233704',
      email: '1234567890@qq.com',
      organization: '海知智能',
      skilled: '人工智能',
      duration: '15小时',
      role: '4',
      action: '重新编辑',
    },
    {
      id: '2',
      fullname: '管理员',
      mobile: '18513233701',
      email: '1234567890@qq.com',
      organization: '海知智能',
      skilled: '人工智能',
      duration: '15小时',
      role: '1',
      action: '重新编辑',
    },
  ],
  '/review/getStats': {
    code: 1,
    msg: '任务列表、统计获取成功',
    token: '15221255d1212b123a12ff12eccc211b',
    data: {
      reviewedEntityNum: 10000,
      reviewedTripleNum: 20000,
      reviewTimeSpan: 12564,
      reviewRecord: [
        {
          jobId: 1500,
          startTime: '2018-10-16',
          reviewSpan: 45,
          jobStatus: 2,
          currentPage: 4,
          finishedCount: 50,
        },
      ],
    },
  },
  '/review/getTask': {
    code: 0,
    msg: '领取成功',
    token: '15221255d1212b123a12ff12eccc211b',
    data: {
      jobId: 123,
      jobType: 1,
      elements: initAuditTasks(15),
    },
  },
  '/review/continueTask': {
    code: 0,
    msg: '领取成功',
    token: '15221255d1212b123a12ff12eccc211b',
    data: {
      jobId: 123,
      jobType: 1,
      currentPage: 4,
      reviewSpan: 45,
      elements: initAuditTasks(15),
    },
  },
  '/review/saveTask': {
    code: 1,
    msg: '保存成功',
    token: '15221255d1212b123a12ff12eccc211b',
  },
  '/review/commitTask': {
    code: 1,
    msg: '提交成功',
    token: '15221255d1212b123a12ff12eccc211b',
  },
  '/acceptance/getTask': {
    code: 0,
    msg: '领取成功',
    token: '15221255d1212b123a12ff12eccc211b',
    data: {
      jobId: 123,
      elements: initCheckTasks(20),
    },
  },
  '/acceptance/continueTask': {
    code: 0,
    msg: '领取成功',
    token: '15221255d1212b123a12ff12eccc211b',
    data: {
      jobId: 123,
      currentPage: 4,
      acceptanceSpan: 45,
      elements: initCheckTasks(20),
    },
  },
  '/acceptance/saveTask': {
    code: 1,
    msg: '保存成功',
    token: '15221255d1212b123a12ff12eccc211b',
  },
  '/acceptance/commitTask': {
    code: 1,
    msg: '提交成功',
    token: '15221255d1212b123a12ff12eccc211b',
  },
};
export default data;
