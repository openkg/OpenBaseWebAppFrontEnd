import React from 'react';
// import pinyin from 'pinyin'
import { Link } from 'react-router';
import CSSModule from 'react-css-modules';
import { connect } from 'react-redux';
import styles from './mapList.scss';
import Button from '../common/Button';
import message from '../common/Message';
import bebounceDecorator from '../../utils/debounce';
import request from '../../utils/request';
import user from '../../utils/localData';
import { setSearchValue } from '../../actions/chat';

/* eslint-disable */
const getAlphabetList = () =>
  (new Array(26)).fill(65)
    .map((v, i) => v + i)
    .map(charCode => String.fromCharCode(charCode))

// const getZHCapital = name => {
//   return pinyin((name || '').slice(0, 1), { style: pinyin.STYLE_FIRST_LETTER }).join('').toUpperCase()
// }

const mapStateToProps = state => {
  const { searchValue } = state.chat
  return {
    searchValue,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setSearchValue(value) {
      dispatch(setSearchValue(value))
    },
  }
}
@connect(mapStateToProps, mapDispatchToProps)
@CSSModule(styles, { allowMultiple: true })
class MapGraph extends React.Component {
  constructor(props) {
    super(props)
    this.$input = React.createRef()
    this.state = {
      firstletter: '',
      data: [],
      pageIndex: 1,
      pageCount: 0,
      showResult: false,
    }
    this.totalCount = 0
    this.pageSize = 30
  }
  componentDidMount() {
    message.loading(true)
    const { searchValue } = this.props
    if (searchValue) {
      this.$input.current.focus()
    }

    this.fetchList({ entity: searchValue })
  }
  componentWillUnmount() {
    const { value } = this.$input.current
    const { setSearchValue } = this.props
    setSearchValue({ payload: value })
  }

  handleChange = e => {
    const { value } = e.target
    this.props.setSearchValue({ payload: value })
  }
  handleKeyDown = e => {
    if (e.keyCode === 13) {
      const { searchValue } = this.props
      this.fetchList({ entity: searchValue, pageIndex: 1 })
    }
  }
  handleCilck = value => {
    message.loading(true)
    const { firstletter } = this.state
    const resetAlphabet = firstletter === value ? '' : value
    this.setState({ firstletter: resetAlphabet })
    this.fetchList({ firstletter: resetAlphabet, pageIndex: 1 })
  }
  changePageIndex = index => {
    const { pageCount } = this.state
    if (index <= pageCount && index >= 1) {
      this.fetchList({ pageIndex: index })
    }
  }
  fetchList = params => {
    const {
      entity = this.props.searchValue,
      pageIndex = this.state.pageIndex,
      firstletter = this.state.firstletter,
    } = params
    const name = entity && firstletter ? '' : entity
    this.props.setSearchValue({ payload: name })
    const { pageSize } = this
    const data = {
      entity: name,
      firstletter,
      pageSize,
      pageIndex,
      token: user.token(),
    }
    request('/viewKG/entityname/', data, { method: 'GET' }).then(res => {
      const { code, data, page } = res
      // message.loading(false)
      if (code === 0) {
        const { countTotal } = page
        this.totalCount = countTotal
        const pageCount = Math.ceil(countTotal / pageSize)
        this.setState({
          data,
          pageIndex,
          pageCount,
          firstletter,
          showResult: true,
        })
      } else {
        this.setState({
          data: {},
          showResult: true,
        })
      }
    }).catch(error => {
      console.log(error)
      message.loading(true)
    })
  }

  render() {
    const { searchValue } = this.props
    const { firstletter, pageIndex, pageCount, data, showResult } = this.state
    const { RetrievedEntities: list, agriculture_count, buddism_count, kg4ai_count, people_count } = data
    return (
      <div>
        <form styleName="search" onSubmit={e => { e.preventDefault() }}>
          <input
            type="text"
            placeholder="搜索学者"
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            ref={this.$input}
            defaultValue={searchValue}
          />
        </form>
        {
          showResult &&
          <div styleName="resulte">
            <div styleName="sumary">
              <span>全部({this.totalCount})</span>
              <span>kg4ai({kg4ai_count})</span>
              <span>佛学({buddism_count})</span>
              <span>农业({agriculture_count})</span>
              <span>百科人物({people_count})</span>
            </div>
            {
              list.length > 0
                ? <ul>
                  {
                    list.map(
                      professional => (
                        <li key={professional['@id']}>
                          <Link to={`/index/atlaslist/${encodeURIComponent(professional['@id'])}`}>{professional['@name']}</Link>
                        </li>
                      ),
                    )
                  }
                </ul>
                : <p>你所搜索的实体暂时没有结果，换一个实体试试？</p>
            }
          </div>
        }

        {
          this.totalCount > this.pageSize &&
          <div styleName="btn-control">
            <Button
              styleClass="border"
              className={`${pageIndex === 1 ? styles['not-allowed'] : ''}`}
              onClick={() => { this.changePageIndex(pageIndex - 1) }}
            > 上一页
            </Button>
            <Button
              className={`${pageIndex === pageCount ? styles['not-allowed'] : ''}`}
              onClick={() => { this.changePageIndex(pageIndex + 1) }}
            > 下一页
            </Button>
          </div>
        }
      </div>
    )
  }
}

/* eslint-disable */
export default MapGraph
