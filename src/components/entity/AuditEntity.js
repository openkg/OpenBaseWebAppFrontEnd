import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './AuditEntity.scss';
import CheckBox from '../common/CheckBox';
import Timer from '../common/Timer';
import Pagination from '../common/Pagination';
import Dialog from '../common/Dialog';
import { redirect } from '../../utils/history';
import { errorHandler, auditResponseHandler } from '../../utils';
import { getToken, getRole } from '../../utils/localData';
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
      displayItems: [],
    };
    this.elements = [];
    this.pageSize = 9;
    this.jobId = this.props.routeParams.jobId;
  }
  componentDidMount() {
    const role = getRole();
    if (role === '4') {
      const { source = 'kg4ai' } = this.props;
      redirect(`/index/auditsumary/${source}`);
    }
    this.initPage();
  }
  onCheck = ({ checked, value }) => {
    const element = this.elements.find(item => {
      return item.subjectId === value;
    });
    element.reviewedRes = checked ? 0 : 1;
  };
  onPageChange = ({ pageIndex }) => {
    if (this.props.jobStatus === 0) {
      this.saveTask(pageIndex - 1);
    }
    this.setPageinfo({ pageIndex });
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
    const reviewSpan = Math.ceil(Timer.getTimeSpan() / 60);

    const items = elements.map(item => {
      const element = {
        subjectId: item.subjectId,
        reviewedRes: item.reviewedRes,
      };

      return element;
    });
    const data = { token, jobId, currentPage, reviewSpan, data: items };

    return data;
  };
  initPage = () => {
    const token = getToken();
    const { jobId } = this;
    const { getAuditTask, continueAuditTask } = this.props.ACTIONS;

    const pageIndex = 1;
    const { elements } = this.props;
    if (elements && elements.length > 0) {
      this.setPageinfo({ pageIndex });
    } else {
      const result = jobId ? continueAuditTask({ token, jobId }) : getAuditTask({ token }) // eslint-disable-line
      result
        .then(errorHandler)
        .then(auditResponseHandler)
        .then(data => {
          this.setPageinfo({ pageIndex });
          this.jobId = data.data.jobId;
        });
    }
  };
  saveTask = currentPage => {
    const data = this.getParams(currentPage);
    this.props.ACTIONS.saveAuditTask(data);
  };
  submitTask = () => {
    const data = this.getParams();
    this.props.ACTIONS.commitAuditTask(data)
      .then(errorHandler)
      .then(data => {
        modal.show({
          content: data.msg,
          onClose: () => {
            modal.close();
            const { source = 'kg4ai' } = this.props;
            redirect(`/index/auditsumary/${source}`);
          },
        });
      });
  };
  render() {
    const { elements = [], jobStatus, source } = this.props || [];
    const totalCount = elements.length;
    const current = 1;
    this.elements = elements.slice();

    return (
      <div styleName="container">
        <div styleName="header">
          <h5 styleName="title">{`正在审核 —— ${domainMap[source] || 'KG 4 AI'} 实体`}</h5>
          <p styleName="caption">请挑选出下列属于人工智能专家学者：</p>
          {jobStatus === 0 && <Timer className={styles.clock} />}
        </div>
        <div styleName="entities">
          {this.state.displayItems.map(item => {
            return (
              <li styleName="item-box" key={item.order}>
                <CheckBox onChange={this.onCheck} checked={item.reviewedRes === 0} value={item.subjectId} />
                <div styleName="entity">
                  <p styleName="name">{item.name}</p>
                  <p styleName="desc" title={item.sumary}>
                    {item.sumary}
                  </p>
                </div>
              </li>
            );
          })}
        </div>
        <Pagination
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
