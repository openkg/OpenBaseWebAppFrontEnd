import React from 'react';
import CSSModule from 'react-css-modules';
import { Link } from 'react-router';
import styles from './index.scss';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import Dialog from '../common/Dialog';
import Timer from '../common/Timer';
import Select from '../common/Select';
import { errorHandler, auditResponseHandler, checkResponseHandler } from '../../utils';
import { redirect } from '../../utils/history';
import { getToken, getRole } from '../../utils/localData';
import { domainMap, options } from '../../utils/fieldMap';

let modal = null;
Dialog.newInstance({}, instance => {
  modal = instance;
});

const find = (name, value, array) => {
  const result = array.find(item => {
    return item[name] === value;
  });
  return result;
};
@CSSModule(styles, { allowMultiple: true })
class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayItems: [],
    };
    this.pageSize = 15;
    this.triples = [];
    this.elements = [];
    this.select = null;
    this.jobId = this.props.routeParams.jobId;
  }
  componentDidMount() {
    const role = getRole();
    if (role === '4') {
      this.doRedirect();
    }
    this.initPage();
  }
  onPageChange = ({ pageIndex, pageCount }) => {
    if (this.props.jobStatus === 0) {
      this.saveTask(pageIndex - 1);
    }
    this.setPageinfo({ pageIndex, pageCount });
  };
  onCheck = (e, record, resType) => {
    const { subjectId, tripleId } = record;
    let reviewedRes = parseInt(e.target.value, 10);
    if (resType === 'reviewedRes' && reviewedRes === 2) {
      reviewedRes = 21;
      // this.select.setValue(11)
    }
    this.updateTriple({ subjectId, tripleId, reviewedRes, resType });
  };
  onSelect = (value, record, resType) => {
    const { subjectId, tripleId } = record;
    const reviewedRes = value;
    this.updateTriple({ subjectId, tripleId, reviewedRes, resType });
  };
  setPageinfo = ({ pageIndex }) => {
    const size = this.pageSize;
    const items = this.triples.slice((pageIndex - 1) * size, pageIndex * size);
    this.setState({ displayItems: items });
    this.currentPage = pageIndex;
  };
  getParams = currentPage => {
    const token = getToken();
    const { jobId, pageSize } = this;
    let { elements } = this;
    if (currentPage) {
      elements = this.elements.slice((currentPage - 1) * pageSize, currentPage * pageSize) // eslint-disable-line
    }
    currentPage = currentPage || this.currentPage;
    const reviewSpan = Math.ceil(Timer.getTimeSpan() / 60);
    const timeSpanType = this.props.action === '验收' ? 'acceptanceSpan' : 'reviewSpan';

    const triples = elements.map(item => {
      const element = {
        subjectId: item.subjectId,
        triples: (item.triples || []).map(triple => {
          return {
            tripleId: triple.tripleId,
            reviewedRes: triple.reviewedRes,
            acceptanceRes: triple.acceptanceRes,
          };
        }),
      };

      return element;
    });
    const data = {
      token,
      jobId,
      currentPage,
      [timeSpanType]: reviewSpan,
      data: triples,
    };

    return data;
  };
  doRedirect = () => {
    const { action, source = 'kg4ai' } = this.props;
    const page = action === '验收' ? 'checksumary' : 'auditsumary';
    const url = `/index/${page}/${source}`;
    redirect(url);
  };
  updateTriple = ({ subjectId, tripleId, reviewedRes, resType = 'reviewedRes' }) => {
    const element = find('subjectId', subjectId, this.elements);
    if (element) {
      const triple = find('tripleId', tripleId, element.triples);
      if (triple) {
        triple[resType] = reviewedRes;
      }
    }
  };
  initTriples = elements => {
    const triples = [];
    elements.forEach(item => {
      const items = (item.triples || []).map(triple => {
        return Object.assign({}, triple, {
          subject: item.subject || item.name,
          subjectId: item.subjectId,
        });
      });
      triples.push(...items);
    });
    return triples;
  };
  initPage = () => {
    const token = getToken();
    const { jobId } = this;
    const { getTask, continueTask } = this.props.ACTIONS;

    const pageIndex = 1;
    if (this.elements.length === 0) {
      const result = jobId ? continueTask({ token, jobId }) : getTask({ token }) // eslint-disable-line
      const responseHandler = this.props.action === '验收' ? checkResponseHandler : auditResponseHandler;
      result
        .then(errorHandler)
        .then(responseHandler)
        .then(data => {
        const elements = data.data && data.data.elements ? data.data.elements : [] // eslint-disable-line
          this.triples = this.initTriples(elements);
          this.elements = elements;
          this.jobId = data.data.jobId;

          this.setPageinfo({ pageIndex });
        });
    } else {
      this.triples = this.initTriples(this.elements);
      this.setPageinfo({ pageIndex });
    }
  };
  saveTask = currentPage => {
    const data = this.getParams(currentPage);
    this.props.ACTIONS.saveTask(data);
  };
  submitTask = () => {
    const data = this.getParams();
    this.props.ACTIONS.commitTask(data)
      .then(errorHandler)
      .then(data => {
        modal.show({
          content: data.msg,
          onClose: () => {
            modal.close();
            this.doRedirect();
          },
        });
      });
  };
  auditAction = record => {
    return (
      <React.Fragment>
        <label>
          <input
            type="radio"
            value={0}
            name={`option_${record.tripleId}`}
            defaultChecked={record.reviewedRes === 0}
            onChange={e => {
              this.onCheck(e, record);
            }}
          />
          正确
        </label>
        <div className={styles.wrong}>
          <label>
            <input
              type="radio"
              value={2}
              name={`option_${record.tripleId}`}
              defaultChecked={record.reviewedRes > 20}
              onChange={e => {
                this.onCheck(e, record);
              }}
            />
            错误
          </label>
          <Select
            options={options}
            size="small"
            defaultValue={record.reviewedRes < 20 ? 21 : record.reviewedRes}
            onChange={value => {
              this.onSelect(value, record);
            }}
            ref={instance => {
              this.select = instance;
            }}
          />
        </div>
        <label>
          <input
            type="radio"
            value={1}
            name={`option_${record.tripleId}`}
            defaultChecked={record.reviewedRes === 1}
            onChange={e => {
              this.onCheck(e, record);
            }}
          />
          不知道
        </label>
      </React.Fragment>
    );
  };
  checkAction = record => {
    return (
      <React.Fragment>
        <p>
          <span>{record.reviewedStatistics}</span>
          <Link to={`/index/atlaslist/${encodeURIComponent(record.subjectId)}`} className={styles.detail}>
            详情
          </Link>
        </p>
        <p>
          <label>
            <input
              type="radio"
              value={0}
              name={`option_${record.tripleId}`}
              defaultChecked={record.acceptanceRes === 0}
              onChange={e => {
                this.onCheck(e, record, 'acceptanceRes');
              }}
            />
            正确
          </label>
          <label>
            <input
              type="radio"
              value={1}
              name={`option_${record.tripleId}`}
              defaultChecked={record.acceptanceRes === 1}
              onChange={e => {
                this.onCheck(e, record, 'acceptanceRes');
              }}
            />
            错误
          </label>
        </p>
      </React.Fragment>
    );
  };
  render() {
    const current = 1;
    const { action = '验收', jobStatus, elements = [], source } = this.props || [];
    const totalCount = this.triples.length;

    this.elements = elements;
    const columns = [
      {
        title: '序号',
        name: 'tripleId',
        // cls: 'nowrap',
      },
      {
        title: '实体1',
        name: 'subject',
        // cls: 'nowrap',
      },
      {
        title: '关系／属性',
        name: 'property',
        cls: 'nowrap',
      },
      {
        title: '实体2',
        name: 'object',
      },
      {
        title: '操作',
        name: 'result',
        cls: 'result',
        render: (col, record) => {
          const result = action === '验收' ? this.checkAction(record) : this.auditAction(record);
          return result;
        },
      },
    ];
    return (
      <div styleName="container">
        <div styleName="header">
          <h5 styleName="title">{`正在${action} —— ${domainMap[source] || 'KG 4 AI'} 关系`}</h5>
          <p styleName="caption">{`请${action}以下实体之间的关系：`}</p>
          {jobStatus === 0 && <Timer className={styles.clock} />}
        </div>
        <Table columns={columns} dataSource={this.state.displayItems} parentStyles={styles} />
        <Pagination
          className={styles.buttons}
          totalCount={totalCount}
          pageSize={this.pageSize}
          current={current}
          showSubmit={jobStatus === 0}
          onSubmit={this.submitTask}
          onChange={this.onPageChange}
        />
      </div>
    );
  }
}
export default Index;
