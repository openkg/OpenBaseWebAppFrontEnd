import React from 'react';

const introImg = require('../../assets/images/intro.svg');

const Introduce = () => {
  return (
    <div className="content part-two">
      <div className="part-title">
        <img src={introImg} width="36" height="36" alt="intro" />
        <span>介绍</span>
      </div>
      <div className="main-content">
        <div className="content-left">
          <div className="content-title">
            <img src="https://qiniu.ruyi.ai/vision.png" width="30" height="30" alt="vision" />
            <span>愿景</span>
          </div>
          <div className="content-box left">
            <p>Openbase旨在促进中文知识图谱数据的开放与互联，促进知识图谱和语义技术的普及和广泛应用。</p>
          </div>
        </div>
        <div className="content-right">
          <div className="content-title">
            <img src="https://qiniu.ruyi.ai/data.png" width="35" height="30" alt="data" />
            <span>数据概况</span>
          </div>
          <div className="content-box right">
            <div className="item">
              <div className="title">三元组数</div>
              <div className="num">107,264,094</div>
            </div>
            <div className="item">
              <div className="title">实体数</div>
              <div className="num">11,513,944</div>
            </div>
            <div className="item">
              <div className="title">属性数</div>
              <div className="num">92,247,120</div>
            </div>
            <div className="item">
              <div className="title">任务数</div>
              <div className="num">47,824</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
