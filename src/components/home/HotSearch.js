import React from 'react';
import { Link } from 'react-router';
import Button from '../common/Button';
import { history, localData, randomInt, request } from '../../utils';
import user from '../../utils/localData';

/* eslint-disable */
const pageSize = 30;
const sources = [
  { name: 'all', text: '全部' },
  { name: 'kg4ai', text: '人工智能学者', field: 'kg4ai_count' },
  { name: 'buddism', text: '佛学', field: 'buddism_count' },
  { name: 'agriculture', text: '农业', field: 'agriculture_count' },
  { name: 'people', text: '人物', field: 'people_count' },
  { name: '7Lore', text: '七律', field: '7Lore_count' },
  { name: 'acgn', text: '二次元', field: 'acgn_count' },
  { name: 'kg4openkg', text: 'kg4openkg', field: 'kg4openkg_count' },
  { name: 'xlore', text: '清华Xlore', field: 'xlore_count' },
  { name: 'legal', text: '法律', field: 'legal_count' },
  { name: 'beltAndRoad', text: '一带一路', field: 'beltAndRoad_count' },
];
class HotSearch extends React.Component {
  constructor(props) {
    super(props);

    const { params = {} } = props;
    this.state = {
      data: {},
      page: {},
      source: 'all',
      pageIndex: 1,
      isHot: !params.keyword,
      searchValue: params.keyword || '',
      userInfo: null,
    };
  }
  componentDidMount() {
    this.getSearchList(false, false, true, false);
    this.setState({ userInfo: user.userInfo(false) });
  }
  changePageIndex = index => {
    if (index <= this.pageCount && index >= 1) {
      this.setState({ pageIndex: index }, () => {
        this.getSearchList();
      });
    }
  };
  getSearchList = (random = false, resetPagination = false, updateCount = true, redirect = true) => {
    const { searchValue, source } = this.state;
    const query = this.props.params || {};
    const pageIndex = random ? randomInt(1, this.pageCount) : resetPagination ? 1 : this.state.pageIndex;
    const params = {
      pageSize,
      pageIndex,
      source,
      token: localData.getToken(),
    };
    if (searchValue) {
      params.entity = encodeURI(searchValue);
    }

    request
      .default('/viewKG/entityname/', params, { method: 'GET' })
      .then(res => {
        const { code, data, page } = res;
        if (code === 0) {
          const pageCount = Math.ceil(data.total_count / pageSize);
          this.pageCount = pageCount;
        }

        const lastData = this.state.data;
        const { RetrievedEntities, ...rest } = lastData;
        const newData = updateCount ? data : { RetrievedEntities: data.RetrievedEntities, ...rest };
        this.setState({ data: newData, page, isHot: !searchValue });
      })
      .catch(error => { });
    if ((searchValue != query.keyword && query.keyword) || redirect) {
      history.redirect(`/index/search/${searchValue}`);
    }
  };
  handleKeydown = e => {
    if (e.keyCode === 13) {
      const { searchValue } = this.state;

      if (location.hash.indexOf('/index/search') > -1) {
        console.log('asdfsajkdfl');
        this.setState({ source: 'all' }, () => this.getSearchList());
      }

      history.redirect(`/index/search/${searchValue}`);
    }
  };
  handleSearchChange = e => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  };
  handleSourceFilter = source => {
    this.setState({ source }, () => {
      this.getSearchList(false, true, false);
    });
  };
  hotSearch = () => {
    this.setState({ searchValue: '' }, () => {
      this.getSearchList();
      history.redirect('/index/search');
    });
  };
  render() {
    console.log(this.state)
    const { pageIndex, userInfo } = this.state;
    const { className = '' } = this.props;
    const { searchValue, data, isHot, source } = this.state;
    const searchList = data.RetrievedEntities || [];
    const { total_count } = data;
    const isEmpty = data.RetrievedEntities && data.RetrievedEntities.length === 0;

    return (
      <div className={`hot-search ${className}`}>
        <div className="search-input">
          <input type="text" value={searchValue} placeholder="输入你想查询的实体" onKeyDown={this.handleKeydown} onChange={this.handleSearchChange} />
          <button
            onClick={e => {
              this.setState({ source: 'all' }, () => this.getSearchList());
            }}
            onKeyDown={this.handleKeydown}
          >
            搜索
          </button>
        </div>
        {!isHot && (
          <div className="search-bar">
            <h5>{`找到${sources.filter(item => data[item.field] > 0).length}个图谱上的${total_count}个实体：`}</h5>
            <div className="tabbar">
              <span className="hot" onClick={this.hotSearch}>
                热门
              </span>
              {sources.map(item => {
                const { name, text, field } = item;
                const className = source === name ? 'active' : '';
                const _text = field ? `${text}(${data[field]})` : text;
                return (
                  (name === 'all' || data[field] > 0) && (
                    <span key={name} className={className} onClick={e => this.handleSourceFilter(name)}>
                      {_text}
                    </span>
                  )
                );
              })}
            </div>
          </div>
        )}
        <div className="search-list">
          {isHot && <span className="search-title">热门搜索</span>}
          <div className="search-result">
            {searchList.map(item => (
              <span key={item['@id']}>
                <Link to={`/index/atlaslist/${encodeURIComponent(item['@id'])}`}>{item['@name']}</Link>
              </span>
            ))}
            {isEmpty && <p>你所搜索的实体暂时没有结果，换一个实体试试？</p>}
          </div>
          {isHot && (
            <div className="search-switch">
              <button className="button" onClick={e => this.getSearchList(true)}>
                换一批
              </button>
            </div>
          )}
        </div>
        {this.pageCount > 1 && !isHot && (
          <div className="buttons">
            <Button
              className={`${pageIndex === 1 ? 'not-allowed' : ''}`}
              onClick={() => {
                this.changePageIndex(pageIndex - 1);
              }}
            >
              {' '}
              上一页
            </Button>
            <Button
              className={`${pageIndex === this.pageCount ? 'not-allowed' : ''}`}
              onClick={() => {
                this.changePageIndex(pageIndex + 1);
              }}
            >
              {' '}
              下一页
            </Button>
          </div>
        )}
        {searchList.length > 0 && userInfo && (
          <Link
            style={{
              display: 'flex',
              background: 'rgba(53,122,228,1)',
              color: 'white',
              height: '50px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '20px',
              marginTop: '10px',
            }}
            to={`/index/atlaslist/${encodeURIComponent(searchList[0]['@id'])}?actionId=1`}
          >
            新增词条+
          </Link>
        )}
      </div>
    );
  }
}

export default HotSearch;
