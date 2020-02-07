import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './index.scss';
import { errorHandler } from '../../utils';
import { redirect } from '../../utils/history';
import { getToken } from '../../utils/localData';
import Table from '../common/Table';
import Button from '../common/Button';
import message from '../common/Message';
import { domainMap } from '../../utils/fieldMap';

@CSSModule(styles, { allowMultiple: true })
class Index extends React.PureComponent {
  componentDidMount() {
    const { source = 'kg4ai' } = this.props.params;
    this.getRecord(source);
  }
  componentWillReceiveProps(nextProps) {
    const { source } = nextProps.params;
    const { source: preSource } = this.props.params;
    if (source !== preSource) {
      this.getRecord(source);
    }
  }
  getRecord = source => {
    message.loading(true);
    const { fetchRecord } = this.props.ACTIONS;
    const param = { token: getToken(), source };
    fetchRecord(param)
      .then(() => {
        message.loading(false);
      })
      .catch(error => console.log(error));
  };
  clickTask = jobId => {
    const token = getToken();
    const {
      action,
      params: { source },
    } = this.props;
    const { getTasks, continueTasks, updateSource } = this.props.ACTIONS;
    const param = { source, token };
    let requestTasks = null;

    if (jobId) {
      requestTasks = continueTasks;
      param.jobId = jobId;
    } else {
      requestTasks = getTasks;
    }
    requestTasks(param)
      .then(errorHandler)
      .then(data => {
        const query = `/${data.data.jobId}`;
        const op = action === '验收' ? 'check' : 'audit';
        const type = data.data.type === 'entity' ? 'Entity' : 'Relationship';
        const path = `/index/${op + type + query}`;

        // 更新source
      updateSource && updateSource(source) // eslint-disable-line
        redirect(path);
      });
  };
  beginTask = () => {
    const { history } = this.props;
    const task = (history || []).find(item => {
      return item.statusId === 0;
    });
    const jobId = task ? task.jobId : '';
    this.clickTask(jobId);
  };
  applyForAI = () => {
    redirect('/index/question');
  };
  render() {
    const { total, finished, entityNum, tripleNum, timeSpan, action = '验收' } = this.props || {};

    const role = sessionStorage.getItem('role') || '4';
    const columns = [
      {
        title: '任务序号',
        name: 'jobId',
      },
      {
        title: `${action}日期`,
        name: 'date',
      },
      {
        title: `${action}时长`,
        name: 'timeSpan',
      },
      {
        title: '当前状态',
        name: 'StatusText',
      },
      {
        title: '操作',
        name: 'action',
        render: (col, record) => {
          return (
            <span
              className={styles.action}
              onClick={() => {
                this.clickTask(record.jobId);
              }}
            >
              {record.action}
            </span>
          );
        },
      },
    ];
    const data = this.props.history;
    const path = this.props.router.location.pathname.split('/');
    const type = path[path.length - 1];
    if (role === '4') {
      return (
        <div styleName="container guest">
          <h5 styleName="title">可选择的图谱包括</h5>
          <div styleName="content">
            <Button styleName="button apply-ai" onClick={this.applyForAI}>
              申请成为KG FOR AI的审核者
            </Button>
            <Button disabled styleName="button apply-fina">
              申请成为金融的审核者(待开放)
            </Button>
          </div>
        </div>
      );
    }
    const style = { width: `${finished / total}%` };
    return (
      <div styleName="container">
        <h5 styleName="title">{`正在${action}`}</h5>
        <div styleName="header">
          <div styleName="progress">
            <span styleName="label">{`当前${action}进度`}</span>
            {finished > 0 ? (
              <div styleName="bar">
                <p styleName="total">
                  <span>{total}</span>
                </p>
                <p styleName="finished" style={style}>
                  <span>{finished}</span>
                </p>
              </div>
            ) : (
              <div styleName="empty-bar">您当前还未开始审核</div>
            )}
          </div>
          <div styleName="total-count">
            <span styleName="label">{`您已经累计${action}`}</span>
            <ul>
              <li>
                <span>{entityNum}</span>
                <span>个实体</span>
              </li>
              <li>
                <span>{tripleNum}</span>
                <span>个关系</span>
              </li>
              <li>
                <span>{timeSpan}</span>
                <span>{`分钟（${action}时长）`}</span>
              </li>
            </ul>
          </div>
        </div>
        <div styleName="ready-content">
          <p styleName="title">{`准备好开始${action}任务了吗？`}</p>
          <p styleName="subtitle">
            {domainMap[type]}项目，简介：人工智能领域数据，总共200{`道题，预计${action}时长40分钟`}
          </p>
          <Button styleName="begin-task" onClick={this.beginTask}>{`开始${action}`}</Button>
        </div>
        <div styleName="history">
          <p styleName="title">历史记录</p>
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    );
  }
}
export default Index;
