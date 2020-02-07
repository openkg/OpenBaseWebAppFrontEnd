import React from 'react';

class UseCase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      more: false,
    };
  }
  toggleSide = () => {
    const scrollBox = document.getElementsByClassName('part-five')[0];
    const { more } = this.state;
    scrollBox.scrollLeft = more ? 0 : 10000;
    this.setState({ more: !more });
  };
  render() {
    const { more } = this.state;
    return (
      /* eslint-disable */
      <div className="content part-five">
        <div className="part-title">
          <img src="https://qiniu.ruyi.ai/graph.png" width="36" height="36" alt="graph" />
          <span>知识图谱</span>
        </div>
        <div>
          <div className="graph-left">
            <img src="https://qiniu.ruyi.ai/graph_rel.jpg" alt="graph_rel" />
            <p>知识图谱旨在通过建立数据之间的关联链接，将碎片化的数据有机地的组织起来，让数据更加容易被人和机器理解和处理，并为搜索、挖掘、分析等提供便利，为人工智能的实现提供知识库基础。</p>
          </div>
          <div className="graph-center">
            <div className={`switch-btn right ${more ? 'hidden' : ''}`}>
              <img src="https://qiniu.ruyi.ai/to_left.svg" alt="to_left" onClick={this.toggleSide} />
            </div>
            <div className={`switch-btn left ${more ? '' : 'hidden'}`}>
              <img src="https://qiniu.ruyi.ai/to_right.svg" alt="to_right" onClick={this.toggleSide} />
            </div>
          </div>
          <div className="graph-right">
            <div className="case-wrapper">
              <div className="case-title">应用案例</div>
              <div className="case-box">
                <div className="box-top">
                  <div className="sub-title">中医药术语系统</div>
                </div>
                <div className="box-bottom">
                  <p><span>介绍：</span>中医药术语系统是运用计算机与信息技术等工具，对中医药学各领域中的事物、现象、特性、关系和过程进行标记和概括，并为每个概念赋予指称形成概念体系，具有管理中医药术语研究、制作、更新、维护等功能。</p>
                  <p><span>构建机构：</span>中国中医科学院中医药信息研究所</p>
                  <p><span>应用价值：</span>增强中医药知识资源的联通性，面向中医药工作者提供临床知识的完整视图。</p>
                  <p><span>数据概况：</span><br />概念 38,486&nbsp;&nbsp;&nbsp;&nbsp;术语 112,914&nbsp;&nbsp;&nbsp;&nbsp;语义关系 16万余</p>
                </div>
              </div>
            </div>
            <div className="case-wrapper">
              <div className="case-title">应用案例</div>
              <div className="case-box">
                <div className="box-top">
                  <div className="sub-title">KG4AI</div>
                </div>

                <div className="box-bottom">
                  <p><span>介绍：</span>KG4AI是基于AMiner(https://aminer.cn)海量学术数据，和cnSchema.org(http://cnschema.org)构建的一个全球AI领域学术知识图谱。</p>
                  <p><span>构建机构：</span>清华大学</p>
                  <p><span>应用价值：</span>KG4AI知识图谱的发布可以帮助学界和业界更好地了解人工智能领域的学术资源，支撑更多实用服务的开发和应用，例如人才发掘和推荐等。</p>
                  <p><span>数据概况：</span><br />50w本体信息</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default UseCase
