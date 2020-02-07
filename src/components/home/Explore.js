import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../utils';
import { getUserInfo } from '../../utils/localData';
import { setSearchValue } from '../../actions/chat';

const mapDispatchToProps = dispatch => {
  return {
    setSearchValue(value) {
      dispatch(setSearchValue(value));
    },
  };
};
@connect(null, mapDispatchToProps)
class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }
  handleKeydown = e => {
    if (e.keyCode === 13) {
      const { setSearchValue } = this.props;
      setSearchValue({ payload: this.state.searchValue });
      history.redirect('/index/search');
    }
  };
  render() {
    const { searchValue } = this.state;
    return (
      <div className="content part-four">
        <div className="part-title">
          <img src="https://qiniu.ruyi.ai/explore.svg" width="36" height="36" alt="explore" />
          <span>热门搜索</span>
        </div>
        <div className="search-input">
          <input
            type="text"
            value={searchValue}
            placeholder="输入你想查询的实体"
            onKeyDown={this.handleKeydown}
            onChange={e => this.setState({ searchValue: e.target.value })}
          />
        </div>
        <ul className="kglist-content">
          <li className="list-item">
            <span className="content-left">全球人工智能学者知识图谱：kg4ai 20008实体 78888个关系 787663三元组</span>
            <a className="content-right" href="https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/kg4ai_jsonld_openbase.zip">
              下载
            </a>
          </li>
          <li className="list-item">
            <span className="content-left">农业知识图谱</span>
            <a className="content-right" href="https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/agriculture_jsonld_openbase.zip">
              下载
            </a>
          </li>
          <li className="list-item">
            <span className="content-left">人物百科知识图谱：zhishi.me</span>
            <a className="content-right" href="https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/person_jsonld_openbase.zip">
              下载
            </a>
          </li>
          <li className="list-item">
            <span className="content-left">佛学知识图谱</span>
            <a className="content-right" href="https://cnbj1.fds.api.xiaomi.com/openbase-jsonld-data/buddism_jsonld_openbase.zip">
              下载
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Explore;
