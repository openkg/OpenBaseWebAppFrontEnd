import React from 'react';

const items = [
  {
    name: 'kg4ai',
    title: '全球人工智能学者知识图谱',
    entities: '2,034',
    relations: '16,998',
    triples: '26,981',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/kg4ai_jsonld_openbase.zip',
  },
  {
    name: 'agriculture',
    title: '农业知识图谱',
    entities: '32,967',
    relations: '122,795',
    triples: '188,916',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/agriculture_jsonld_openbase.zip',
  },
  {
    name: 'people',
    title: '百科人物知识图谱',
    entities: '913,111',
    relations: '5,298,430',
    triples: '8,980,390',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/person_jsonld_openbase.zip',
  },
  {
    name: 'buddism',
    title: '佛学知识图谱',
    entities: '8,661',
    relations: '41,511',
    triples: '64,862',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/buddism_jsonld_openbase.zip',
  },
  {
    name: '7Lore',
    title: '七律知识图谱',
    entities: '8,618,115',
    relations: '46,089,861',
    triples: '77,815,063',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/7Lore_triple.entities.final.zip',
  },
  {
    name: 'ACGN',
    title: '二次元知识图谱',
    entities: '299,302',
    relations: '1,255,018',
    triples: '2,751,026',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/acgn.entities.final_with_at_id',
  },
  {
    name: 'OneBeltAndRoad',
    title: '一带一路知识图谱',
    entities: '14,308',
    relations: '1,290,747',
    triples: '2,447,378',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/belt_and_road_final',
  },
  {
    name: 'kg4openkg',
    title: '知识图谱领域知识图谱',
    entities: '658',
    relations: '1,713',
    triples: '4,445',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/kg4openkg_final.json_fixed',
  },
  {
    name: 'legal',
    title: '法律知识图谱',
    entities: '26,990',
    relations: '120,736',
    triples: '330,603',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/legalkg_entities_final',
  },
  {
    name: 'xlore',
    title: '清华Xlore知识图谱',
    entities: '1,597,798',
    relations: '6,988,697',
    triples: '14,654,430',
    url: 'https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/xlore.entities.final.zip',
  },
];
const Download = props => {
  const { showTitle = true } = props;
  return (
    <React.Fragment>
      {showTitle && <h5 className="page-title">图谱下载</h5>}
      <div className="kglist-content">
        {items.map(item => {
          return (
            <div className="list-item" key={item.name}>
              <h5 className="title">
                {item.title}：<span>{item.name}</span>
              </h5>
              <div className="kg-statisic">
                <p>
                  <span className="label">实体</span>
                  <span className="value">{item.entities}</span>
                </p>
                <p>
                  <span className="label">关系</span>
                  <span className="value">{item.relations}</span>
                </p>
                <p>
                  <span className="label">三元组</span>
                  <span className="value">{item.triples}</span>
                </p>
                <a className="button download" href={item.url}>
                  下载
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Download;
