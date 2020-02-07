module.exports = {
  questions: {
    method: 'get',
    handler: (req, res) => {
      res.jsonp({
        data: [
          {
            number: 1,
            question: '1.在下列陈述中对人工智能描述不准确的是',
            options: [
              {
                text: 'A.人工智能是研究、开发用于模拟、延伸和扩展人的智能的理论、方法、技术及应用系统的一门新的技术科学。',
                option: 'A',
              },
              {
                text: 'B.人工智能是研究使计算机来模拟人的某些思维过程和智能行为（如学习、推理、思考、规划等）的学科。',
                option: 'B',
              },
              {
                text: 'C.人工智能能根据大量的历史资料和实时时察找出对于未来预测性的洞察。',
                option: 'C',
              },
              {
                text:
                  'D.人工智能是通过射频识别、红外感应器、全球定位系统、激光扫描器等信息传感设备，按约定的协议，把任何物品与互联网相连接，以实现智能化识别、定位、监控和管理的一种网络概念。',
                option: 'D',
              },
            ],
          },
          {
            number: 2,
            question: '2.下列领域中不属于人工智能领域的是',
            options: [
              {
                text: 'A.模式识别',
                option: 'A',
              },
              {
                text: 'B.知识图谱',
                option: 'B',
              },
              {
                text: 'C.神经网络',
                option: 'C',
              },
              {
                text: 'D.自然识别',
                option: 'D',
              },
            ],
          },
        ],
      });
    },
  },
};
