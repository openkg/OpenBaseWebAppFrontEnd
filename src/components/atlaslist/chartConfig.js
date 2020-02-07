const size = 60;
const yy = 250;
function getOption(scholarItem, fieldItem, skills, skilledProfessionals) {
  // 处理links
  const linksSkills = skills.map(skill => {
    return {
      source: scholarItem.name,
      target: skill.name,
      label: skill.property,
    };
  });
  let links = [...linksSkills];

  let data = skills
    .map((skill, index) => {
      return {
        name: skill.name,
        x: 10 * (index % 3),
        y: 10 * (index % 3),
        symbolSize: size,
        category: skill.name,
        itemStyle: {
          color: '#9557D1',
        },
      };
    })
    .concat([
      {
        name: scholarItem.name,
        x: 10,
        y: yy,
        symbolSize: size,
        category: scholarItem.name,
        itemStyle: {
          color: '#4081E5',
        },
        professionId: scholarItem.id,
      },
    ]);

  if (fieldItem) {
    const linksSkilledProfessionals = skilledProfessionals.map(profession => {
      return {
        source: fieldItem.name,
        target: profession.name,
        label: profession.property,
      };
    });
    links = [
      ...linksSkills,
      {
        source: scholarItem.name,
        target: fieldItem.name,
        label: fieldItem.property,
      },
      ...linksSkilledProfessionals,
    ];

    data = [...data]
      .concat([
        {
          name: fieldItem.name,
          x: 10,
          y: yy,
          symbolSize: 72,
          category: fieldItem.name,
          itemStyle: {
            normal: {
              color: '#594AA7',
              borderColor: '#CECECE',
              borderWidth: 20,
            },
          },
        },
      ])
      .concat(
        skilledProfessionals.map((profession, index) => {
          return {
            name: profession.name,
            x: 10 * index,
            y: 10 * (index % 3),
            symbolSize: size,
            category: profession.name,
            itemStyle: {
              color: '#4081E5',
            },
            professionId: profession.id,
          };
        })
      );
  }

  const option = {
    toolbox: {
      show: false,
    },
    series: [
      {
        name: '学术知识图谱',
        type: 'graph',
        hoverAnimation: false,
        cursor: 'auto',
        zoom: 1,
        layout: 'force',
        force: {
          repulsion: 120,
          gravity: 0.1,
          layoutAnimation: false,
        },
        data,
        links,
        roam: true,
        label: {
          normal: {
            show: true,
            position: 'inside',
            formatter(item) {
              const name = (item.name || '').trim();
              if (name.indexOf(' ') > -1) {
                return name.split(' ').join('\n');
              }
              return name.split('').reduce((pre, cur, index, arr) => {
                if (index % 3 === 0 && index > 0 && index !== arr.length - 1) {
                  pre = `${pre + cur}\n`;
                } else {
                  pre += cur;
                }
                return pre;
              }, '');
            },
            fontSize: 14,
          },
        },
        lineStyle: {
          normal: {
            width: 1,
            color: '#868686',
            curveness: 0,
            type: 'solid',
            opacity: 1,
          },
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
          },
        },
        edgeLabel: {
          show: true,
          position: 'middle',
          color: '#868686', // fontFamily待定
          formatter: pagram => {
            return pagram.data.label;
          },
        },
      },
    ],
  };
  return option;
}

export default getOption;
