import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './CheckEntity.scss';
import Table from '../common/Table';
import Timer from '../common/Timer';
import Pagination from '../common/Pagination';
import Dialog from '../common/Dialog';
import { redirect } from '../../utils/history';
import { errorHandler, checkResponseHandler } from '../../utils';
import { getToken } from '../../utils/localData';
import { domainMap } from '../../utils/fieldMap';

let modal = null;
Dialog.newInstance({}, instance => {
  modal = instance;
});

@CSSModule(styles, { allowMultiple: true })
class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      displayItems: [],
    };
    this.elements = [];
    this.pageSize = 9;
    this.jobId = this.props.routeParams.jobId;
  }
  componentDidMount() {
    this.initPage();
  }
  onCheck = (subjectId, value) => {
    const element = this.elements.find(item => {
      return item.subjectId === subjectId;
    });
    element && (element.acceptanceRes = value) // eslint-disable-line
  };
  onPageChange = ({ pageIndex, pageCount }) => {
    if (this.props.jobStatus === 0) {
      this.saveTask(pageIndex - 1);
    }
    this.setPageinfo({ pageIndex, pageCount });
  };
  setPageinfo = ({ pageIndex }) => {
    const size = this.pageSize;
    const items = this.props.elements.slice((pageIndex - 1) * size, pageIndex * size) // eslint-disable-line

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
    const acceptanceSpan = Math.ceil(Timer.getTimeSpan() / 60);

    const items = elements.map(item => {
      const element = {
        subjectId: item.subjectId,
        acceptanceRes: item.acceptanceRes,
      };

      return element;
    });
    const data = { token, jobId, currentPage, acceptanceSpan, data: items };

    return data;
  };
  initPage = () => {
    const token = getToken();
    const { jobId } = this;
    const { getCheckTask, continueCheckTask } = this.props.ACTIONS;

    const pageIndex = 1;
    const { elements } = this.props;
    if (elements && elements.length > 0) {
      this.setPageinfo({ pageIndex });
    } else {
      const result = jobId ? continueCheckTask({ token, jobId }) : getCheckTask({ token }) // eslint-disable-line
      result
        .then(errorHandler)
        .then(checkResponseHandler)
        .then(data => {
          const pageIndex = 1;
          const pageCount = data.data.elements.length;
          this.setPageinfo({ pageIndex, pageCount });
          this.jobId = data.data.jobId;
        });
    }
  };
  saveTask = currentPage => {
    const data = this.getParams(currentPage);
    this.props.ACTIONS.saveCheckTask(data);
  };
  submitTask = () => {
    const data = this.getParams();
    this.props.ACTIONS.commitCheckTask(data)
      .then(errorHandler)
      .then(data => {
        modal.show({
          content: data.msg,
          onClose: () => {
            modal.close();
            const { source = 'kg4ai' } = this.props;
            redirect(`/index/checksumary/${source}`);
          },
        });
      });
  };
  render() {
    const { elements = [], jobStatus, source } = this.props || [];
    const totalCount = elements.length;
    const current = 1;
    this.elements = elements.slice();

    const columns = [
      {
        title: '序号',
        name: 'order',
        cls: 'order',
      },
      {
        title: '实体1',
        name: 'name',
        cls: 'nowrap',
      },
      {
        title: '实体属性',
        name: 'description',
        cls: 'showless',
        onClick: () => {
          console.log(this.state.showMore);
        },
        // render: (col, record) => {
        //   return (
        //     <span>{record.reviewedStatistics}</span>
        //   )
        // },
      },
      {
        title: '验收结果',
        name: 'reviewedStatistics',
        cls: 'result',
        render: (col, record) => {
          return <span>{record.reviewedStatistics}</span>;
        },
      },
      {
        title: '最终确认',
        name: 'finalCheck',
        cls: 'finalCheck',
        render: (col, record) => {
          return (
            <p>
              <label>
                <input
                  type="radio"
                  name={`option_${record.order}`}
                  defaultChecked={record.acceptanceRes === 0}
                  onChange={() => {
                    this.onCheck(record.subjectId, 0);
                  }}
                />
                正确
              </label>
              <label>
                <input
                  type="radio"
                  value={1}
                  name={`option_${record.order}`}
                  defaultChecked={record.acceptanceRes === 1}
                  onChange={() => {
                    this.onCheck(record.subjectId, 1);
                  }}
                />
                错误
              </label>
            </p>
          );
        },
      },
    ];
    return (
      <div styleName="container">
        <div styleName="header">
          <h5 styleName="title">{`正在验收 —— ${domainMap[source] || 'KG 4 AI'} 实体`}</h5>
          <p styleName="caption">请验收以下人物是否属于全球人工智能学术知识图谱：</p>
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
