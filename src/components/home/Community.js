import React from 'react';

const Community = () => {
  return (
    <div className="content part-seven">
      <div className="part-title">
        <img src="https://qiniu.ruyi.ai/community.svg" width="36" height="36" alt="community" />
        <span>加入OpenBase社区</span>
      </div>
      <div className="rank-list-wrapper">
        <div className="rank-list rank-list-left">
          <span className="rank-list-title">任务时间榜单</span>
          <ul>
            <li className="rank-item">
              <span>
                <img src="https://qiniu.ruyi.ai/rank1.png" width="20" alt="rank1" />
              </span>
              <span>1 吴杨</span>
              <span>6小时42分钟</span>
            </li>
            <li className="rank-item">
              <span>
                <img src="https://qiniu.ruyi.ai/rank2.png" width="20" alt="rank2" />
              </span>
              <span>2 李轩</span>
              <span>5小时27分钟</span>
            </li>
            <li className="rank-item">
              <span>
                <img src="https://qiniu.ruyi.ai/rank3.png" width="20" alt="rank3" />
              </span>
              <span>3 朱慧源</span>
              <span>5小时20分钟</span>
            </li>
            <li className="rank-item">
              <span />
              <span>4 李娟</span>
              <span>5小时02分钟</span>
            </li>
            <li className="rank-item">
              <span />
              <span>5 姚光涛</span>
              <span>4小时39分钟</span>
            </li>
          </ul>
        </div>
        <div className="rank-list rank-list-right">
          <span className="rank-list-title">用户贡献榜单</span>
          <ul>
            <li className="rank-item">
              <span>
                <img src="https://qiniu.ruyi.ai/rank_01.svg" alt="rank_01" />
              </span>
              <span>李轩</span>
              <span>编辑321次</span>
            </li>
            <li className="rank-item">
              <span>
                <img src="https://qiniu.ruyi.ai/rank_02.svg" alt="rank_01" />
              </span>
              <span>朱慧源</span>
              <span>编辑290次</span>
            </li>
            <li className="rank-item">
              <span>
                <img src="https://qiniu.ruyi.ai/rank_03.svg" alt="rank_01" />
              </span>
              <span>吴杨</span>
              <span>编辑289次</span>
            </li>
            <li className="rank-item">
              <span>
                <img src="https://qiniu.ruyi.ai/rank_04.svg" alt="rank_01" />
              </span>
              <span>姚光涛</span>
              <span>编辑205次</span>
            </li>
            <li className="rank-item">
              <span>
                <img src="https://qiniu.ruyi.ai/rank_05.svg" alt="rank_01" />
              </span>
              <span>李娟</span>
              <span>编辑195次</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Community;
