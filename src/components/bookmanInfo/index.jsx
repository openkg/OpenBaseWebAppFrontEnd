import _ from 'lodash';
import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './index.scss';
import request from '../../utils/request';
import user from '../../utils/localData';
import Button from '../common/Button';
import Dialog from '../common/Dialog';
import { redirect } from '../../utils/history';
import { withRouter } from 'react-router';

/* eslint-disable */

const domainTypeMap = {
  'kg4ai': 'Scholar',
  'buddism': 'Buddism',
  'people': 'People',
  'agriculture': 'Agriculture',
  '7Lore': 'SevenLore',
  'acgn': 'ACGN',
  'kg4openkg': 'KG4OpenKG',
  'xlore': 'Xlore',
  'legal': 'Legal',
  'beltAndRoad': 'BeltAndRoad'
}

let modal = null
Dialog.newInstance({}, instance => { modal = instance })
const TextItem = props => {
  const { name, text } = props
  return (
    <div className={styles['info-item']}>
      <span className={styles.title}>{name}</span>
      <span className={styles.value}>{text}</span>
    </div>
  )
}
const ImageItem = props => {
  const { name, url } = props
  return (
    <div className={styles['info-item']}>
      <span className={styles.title}>{name}</span>
      <span className={styles.value}><img src={url} /></span>
    </div>
  )
}
const LinkItem = props => {
  const { name, url } = props
  return (
    <div className={styles['info-item']}>
      <span className={styles.title}>{name}</span>
      <a className={styles.website} href={url} target="blank">{url}</a>
    </div>
  )
}

const Select = props => {
  const { onChange, selected } = props
  return <select selected={selected} onChange={onChange} className="input">
    <option value="kg4ai">人工智能学者</option>
    <option value="buddism">佛学</option>
    <option value="people">人物</option>
    <option value="agriculture">农业</option>
    <option value="7Lore">七律</option>
    <option value="acgn">二次元</option>
    <option value="kg4openkg">kgForOpenkg</option>
    <option value="xlore">清华xLore</option>
    <option value="legal">法律</option>
    <option value="beltAndRoad">一带一路</option>
  </select>
}

const ListItem = props => {
  const { name, value } = props
  const text = value.split('?')[0]
  const islink = text.startsWith('http://') || text.startsWith('https://')
  const isimage = islink && /.*(\.png|\.jpg|\.jpeg|\.gif)$/.test(text)
  if (isimage) {
    return <ImageItem name={name} url={value} />
  }
  else if (islink) {
    return <LinkItem name={name} url={value} />
  }
  else {
    return <TextItem name={name} text={value} />
  }
}

class Bookman extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      actionId: 0,
      newPropertyIndex: 1,
      newItems: [],
      items: [],
      showPropertyList: '',
      propertyList: [],
      lock: false
    }
  }
  componentDidMount() {
    const { id } = this.props.routeParams
    const query = window.location.hash.split('?')
    if (query.length > 1) {
      console.log(query)
      this.setEditStatus(Number(query[1].split('=')[1]))
      return
    }
    this.getEntityInfo(id)
  }
  componentWillReceiveProps(nextprops) {
    const { id } = nextprops.routeParams
    if (id === this.props.routeParams.id) {
      return false
    }
    return this.getEntityInfo(id)
  }
  addProperty = () => {
    const newItems = _.cloneDeep(this.state.items)
    // const _items = newItems.filter(item => item.key.startsWith('new_property_'))
    if (newItems.some(e => e.key === `new_property_${this.state.newPropertyIndex}`)) {
      this.setState({ newPropertyIndex: this.state.newPropertyIndex + 1 }, () => this.addProperty())
      return
    }
    newItems.push({ key: `new_property_${this.state.newPropertyIndex++}`, reactKey: `new_property_${this.state.newPropertyIndex}${Math.random()}`, value: '' })
    this.setState({ items: newItems })
  }
  deleteProperty = key => event => {
    let newItems = _.cloneDeep(this.state.items)
    newItems = newItems.filter(e => e.key !== key)
    this.setState({ items: newItems })
  }
  obj2Array = (data) => {
    const keys = Object.keys(data)
    return keys.map(key => {
      return {
        key, value: data[key]
      }
    })
  }
  array2Obj = array => {
    const obj = {}
    array.forEach(item => {
      const { key, value } = item
      obj[key] = value
    })
    return obj
  }
  getEntityInfo = id => {
    return request(`/viewKG/entityId/`, {
      token: user.token(),
      entityId: id,
    }, { method: 'GET' }).then(data => {
      if (!data.data) {
        redirect('/index/search')
        return
      }
      const originData = _.cloneDeep(data.data[0])
      const items = this.obj2Array(data.data.pop())
      this.originItems = _.cloneDeep(items)
      this.setState({ items, data: originData })
    })
  }
  handleCancel = () => {
    const { originItems } = this
    if (originItems) {
      this.setState({ items: originItems, actionId: 0, newPropertyIndex: 1 })
    } else {
      history.back()
    }
  }
  deleteEntity = () => {
    const executeDelete = () => {
      const params = {
        token: user.token(),
        deleteEntity: this.array2Obj(this.state.items)
      }
      request('edit/deleteEntity', params, { method: 'POST' }).then(res => {
        const { code, msg, data } = res
        const message = code === 0 ? '删除成功' : msg
        modal.show({
          content: message,
          onClose: () => {
            modal.close()
            this.props.router.push('/index/search')
          }
        })
      })
    }
    modal.show({
      content: '确认删除实体吗？',
      canClose: true,
      onConfirm: () => {
        modal.close()
        executeDelete()
      },
      onClose: () => {
        modal.close()
      }
    })
  }
  handleInputChange = (key, fieldname, value) => {
    const items = _.cloneDeep(this.state.items)
    this.updateItem(key, fieldname, value, items)
    this.setState({ items })
  }
  handleSelectChange = (key, fieldname, value) => {
    const items = _.cloneDeep(this.state.items)
    this.updateItem(key, fieldname, value, items)
    this.setState({ items })
  }
  handleChange = (key, fieldname) => {
    return e => {
      if (this.state.items.filter(i => i.key === e.target.value).length > 0) {
        e.preventDefault()
        e.target.value = e.target.value.slice(0, e.target.value.length - 1)
        modal.show({
          content: '属性名不能重复',
          onClose: () => {
            modal.close()
          }
        })
        return
      }
      if (e.target.value) {
        const params = { token: user.token(), searchKey: e.target.value }
        const value = e.target.value
        request('edit/searchPropertyNameList', params, { method: 'POST' }).then(res => {
          const { code, msg, data } = res
          if (code !== 0) {
            modal.show({
              content: msg,
              onClose: () => {
                modal.close()
              }
            })
            return
          }
          const list = []
          for (let x in data) {
            list.push(x)
          }
          this.setState({ showPropertyList: value, propertyList: list })
        })
      }
      this.handlePropertyChange(key, fieldname, e.target.value)
    }
  }

  handlePropertyChange = (key, fieldname, value) => {
    const items = _.cloneDeep(this.state.items)
    this.updateItem(key, fieldname, value, items)
    this.setState({ items, lock: false, showPropertyList: '' })
  }
  setEditStatus = actionId => {
    const newState = { actionId }
    if (actionId === 1) {
      newState.items = [{ key: '@name', value: '', reactKey: '@name' }, { key: '@domain', reactKey: '@domain', value: 'kg4ai', type: 'select' }]
    }
    this.setState(newState)
  }
  checkItems = () => {
    for (let item of this.state.items) {
      if (!item.key) {
        modal.show({
          content: '属性名不能为空',
          onClose: () => {
            modal.close()
          }
        })
        return false
      }
      if (!item.value) {
        modal.show({
          content: '属性值不能为空',
          onClose: () => {
            modal.close()
          }
        })
        return false
      }
    }
    return true
  }

  submit = () => {
    const { actionId, items } = this.state
    const url = actionId === 1 ? 'edit/createEntity' : 'edit/updateEntity'
    if (!this.checkItems())
      return
    const params = {
      token: user.token(),
    }

    if (actionId === 1) {
      params.createEntity = this.array2Obj(items)
      params.createEntity['@type'] = domainTypeMap[params.createEntity['@domain']]
    } else {
      params.updateEntity = this.array2Obj(items)
      params.updateEntity['@type'] = domainTypeMap[params.updateEntity['@domain']]
    }

    if (params.createEntity && !params.createEntity['@name']) {
      modal.show({
        content: '@name属性不能为空！',
        onClose: () => {
          modal.close()
        },
      })
      return
    } else if (params.updateEntity && !params.updateEntity['@name']) {
      modal.show({
        content: '@name属性不能为空！',
        onClose: () => {
          modal.close()
        },
      })
      return
    }

    // return
    request(url, params, { method: 'POST' }).then(res => {
      const { code, msg, data } = res
      const message = code === 0 ? '保存成功' : msg
      modal.show({
        content: message,
        onClose: () => {
          modal.close()
          this.setState({ newPropertyIndex: 1 })
          if (actionId === 1) {
            this.props.router.push(`/index/atlaslist/${encodeURIComponent(data['@id'])}`)
          } else {
            this.props.router.push(`/index/atlaslist/${encodeURIComponent(this.state.data['@id'])}`)
          }
          this.setEditStatus(0)
        },
      })
    })

  }
  updateItem = (key, fieldname, value, items) => {
    const item = items.find(item => item.key === key)
    if (item) {
      item[fieldname] = value
    }
  }
  render() {
    const { actionId, data, items } = this.state
    const nameProperty = items.find(i => i.key === '@name')
    const hasNameProperty = nameProperty && nameProperty.value.length > 0
    const userInfo = user.userInfo(false)

    return (
      <div styleName="bookman-info">
        <div className="mg-border" styleName="body">
          <div className="flex-row">
            {actionId === 1 ? <h4>新建实体信息</h4> : <h4>实体信息-{data['@name']}</h4>}
            {
              actionId === 0 && userInfo && (
                <span>
                  <a className="link" onClick={() => this.setEditStatus(1)}>新增词条</a>
                  <a className="link ml10" onClick={() => this.setEditStatus(2)}>编辑</a>
                </span>
              )
            }
            {
              actionId > 0 &&
              <span>
                <a className={`link`} styleName={hasNameProperty ? '' : 'disabled-link'} onClick={hasNameProperty ? () => this.submit() : () => { }}>保存</a>
                {actionId > 1 && <a className="link" styleName="delete-link" onClick={() => this.deleteEntity()}>删除</a>}
                <a className="link ml10" onClick={() => this.handleCancel()}>取消</a>
              </span>
            }

          </div>

          {
            actionId === 0 && items.map((item, index) => {
              const { key, value } = item
              return (
                <ListItem key={key} name={key} value={value} />
              )
            })
          }
          {
            actionId > 0 && items.map((item, index) => {
              const { key, value, type, reactKey } = item
              if ((actionId > 1 && (key === '@name' || key === '@id' || key === '@domain')) || (actionId === 2 && key === 'image')) {
                return <div key={reactKey}></div>
              }
              return (
                <div key={reactKey} className={styles['info-item']}>
                  {actionId > 0
                    ? <div styleName="select-input">
                      <input
                        disabled={key === '@name' || key === '@id' || key === '@domain'}
                        className={`input ${styles.title} mr20`}
                        defaultValue={key}
                        placeholder="请输入属性名称"
                        onBlur={() => {
                          if (!this.state.lock) {
                            this.setState({ showPropertyList: '' })
                          }
                        }}
                        onChange={this.handleChange(key, 'key')} />
                      {this.state.showPropertyList
                        && this.state.showPropertyList === key
                        && <ul onMouseMove={() => this.setState({ lock: true })} onMouseLeave={() => this.setState({ lock: false })}>
                          {this.state.propertyList.map(property =>
                            <li key={property} onClick={e => {
                              this.handlePropertyChange(key, 'key', property);
                              e.target.parentNode.parentNode.firstChild.value = property;
                            }}>{property}</li>
                          )}
                          {this.state.propertyList.length === 0 && <div styleName="no-result">没有相关结果</div>}
                        </ul>}
                    </div>
                    : <span className={styles.title}>{key}</span>}
                  {
                    type === 'select'
                      ? <Select selected={value} styleName="input" onChange={e => this.handleInputChange(key, 'value', e.target.value)} />
                      : value.length <= 50 && <input className="input" styleName="input" placeholder="请输入属性值" defaultValue={value} onChange={e => this.handleInputChange(key, 'value', e.target.value)} />
                  }
                  {value.length > 50 && <textarea rows="3" className="input" styleName="input" placeholder="请输入属性值" value={value} onChange={e => this.handleInputChange(key, 'value', e.target.value)} />}
                  {key !== '@name' && key !== '@id' && key !== '@domain' && <button onClick={this.deleteProperty(key)}>删除</button>}
                </div>
              )
            })
          }
          {
            actionId > 0 && (
              <div className={styles['new-item']}>
                <span onClick={this.addProperty}>添加属性</span>
              </div>
            )
          }
        </div>

        <div styleName="footer">
          <Button onClick={e => window.history.back()} >返回</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModule(Bookman, styles, { allowMultiple: true }))