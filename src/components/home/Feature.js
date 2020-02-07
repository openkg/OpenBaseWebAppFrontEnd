import React from 'react';

const Feature = () => {
  return (
    /* eslint-disable */
    <div className="content part-three">
      <div className="features">
        <div className="part-title">
          <img src="https://qiniu.ruyi.ai/func.png" width="36" height="36" alt="func" />
          <span>功能</span>
        </div>
        <p>你可以通过简单的描述来创建图谱需求、编辑实体条目，由知识图谱专家与行业专家来共同定义数据模式，审核项目，确保图谱的正确性与可用性。同时你也可以搜索或下载图谱。 </p>
        <div className="func-list">
          <div className="func-item">
            <img src={require('../../assets/images/kg-create.svg')} width="84" height="84" alt="create" />
            <div className="func-btn">创建图谱</div>
          </div>
          <div className="func-item">
            <img src={require('../../assets/images/kg-edit.svg')} width="84" height="84" alt="edit" />
            <div className="func-btn">编辑图谱</div>
          </div>
          <div className="func-item">
            <img src={require('../../assets/images/kg-aduit.svg')} width="84" height="84" alt="review" />
            <div className="func-btn">审核图谱</div>
          </div>
          <div className="func-item">
            <img src={require('../../assets/images/kg-download.svg')} width="84" height="84" alt="download" />
            <div className="func-btn">下载图谱</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feature
