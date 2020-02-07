// import
import { getToken, getRole } from './localData';
import { errorHandler, showDialog, history } from './index';

class TaskHandler {
  constructor(props, setState) {
    this.props = props;
    this.role = getRole();
    this.token = getToken();
    this.jobId = props.jobId || '';
    this.jobStatus = props.jobStatus || 0;
    this.getTask = props.getTask;
    this.saveTask = props.saveTask;
    this.commitTask = props.commitTask;
    this.elements = props.elements || [];
    this.pageSize = props.pageSize || 9;
    this.setState = setState || (() => null);
    this.responseHandler = props.responseHandler || (data => data);
  }
  getParams = ({ currentPage, Timer }) => {
    console.log(currentPage, Timer);
  };
  initPage = () => {
    const pageIndex = 1;
    const { jobId, token, elements, getTask, responseHandler } = this;

    if (elements && elements.length > 0) {
      this.setPageinfo({ pageIndex });
    } else {
      const params = jobId ? { token, jobId } : { token };
      getTask(params).then(errorHandler).then(responseHandler).then(data => { // eslint-disable-line
          this.setPageinfo({ pageIndex });
          this.jobId = data.data.jobId;
        });
    }
  };
  onPageChange = ({ pageIndex }) => {
    if (this.jobStatus === 0) {
      this.saveTask(pageIndex - 1);
    }
    this.setPageinfo({ pageIndex });
  };
  setPageinfo = ({ pageIndex }) => {
    const size = this.pageSize;
    const items = this.elements.slice((pageIndex - 1) * size, pageIndex * size) // eslint-disable-line
    this.setState({ displayItems: items });
  };
  saveTask = currentPage => {
    const data = this.getParams(currentPage);
    this.saveTask(data);
  };
  submitTask = redirectPath => {
    const data = this.getParams();
    this.commitTask(data)
      .then(errorHandler)
      .then(data => {
        showDialog({
          content: data.msg,
          onClose: () => {
            history.redirect(redirectPath);
          },
        });
      });
  };
}

class EntityTaskHandler extends TaskHandler {
  constructor(props) {
    const { getAuditTask, continueAuditTask } = props.ACTIONS;
    const option = Object.assign({}, props, {
      action: 'audit',
      jobId: props.routeParams.jobId,
      getTask: props.jobId ? continueAuditTask : getAuditTask,
    });
    super(option);
    this.props = option;
  }

  getParams = ({ currentPage, Timer }) => {
    const { jobId, pageSize, token } = this;
    let elements = this;
    if (currentPage) {
      elements = this.elements.slice((currentPage - 1) * pageSize, currentPage * pageSize) // eslint-disable-line
    }
    const reviewSpan = Math.ceil(Timer.getTimeSpan() / 60);
    const acceptanceSpan = Math.ceil(Timer.getTimeSpan() / 60);

    const items = elements.map(item => {
      const element = {
        subjectId: item.subjectId,
        reviewedRes: item.reviewedRes,
        acceptanceRes: item.acceptanceRes,
      };
      return element;
    });
    const data = {
      token,
      jobId,
      currentPage,
      reviewSpan,
      acceptanceSpan,
      data: items,
    };

    return data;
  };
  onCheck = ({ key, value }) => {
    const element = this.elements.find(item => {
      return item.subjectId === key;
    });
    if (element) {
      element.acceptanceRes = value;
      element.reviewedRes = value;
    }
  };
}

class TripleTaskHandler extends TaskHandler {
  constructor(props) {
    props.action = 'check';
    const { getTask, continueTask } = props.ACTIONS;
    props.getTask = props.jobId ? continueTask : getTask;
    super(props);
  }

  find = (name, value, array) => {
    const result = array.find(item => {
      return item[name] === value;
    });
    return result;
  };
  getParams = (currentPage, Timer) => {
    const token = getToken();
    const { jobId, pageSize } = this;
    let { elements } = this;
    if (currentPage) {
      elements = this.elements.slice((currentPage - 1) * pageSize, currentPage * pageSize) // eslint-disable-line
    }
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
  updateTriple = ({ subjectId, tripleId, reviewedRes, resType = 'reviewedRes' }) => {
    const element = this.find('subjectId', subjectId, this.elements);
    if (element) {
      const triple = this.find('tripleId', tripleId, element.triples);
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
  onCheck = (e, record, resType) => {
    const { subjectId, tripleId } = record;
    let reviewedRes = parseInt(e.target.value, 10);
    if (resType === 'reviewedRes' && reviewedRes === 2) {
      reviewedRes = 21;
    }
    this.updateTriple({ subjectId, tripleId, reviewedRes, resType });
  };
  onSelect = (value, record, resType) => {
    const { subjectId, tripleId } = record;
    const reviewedRes = value;
    this.updateTriple({ subjectId, tripleId, reviewedRes, resType });
  };
  initPage = () => {
    const pageIndex = 1;
    const { jobId, token, elements, getTask, responseHandler } = this;

    if (elements.length === 0) {
      const params = jobId ? { token, jobId } : { token };
      getTask(params)
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
      this.triples = this.initTriples(elements);
      this.setPageinfo({ pageIndex });
    }
  };
}

export default TaskHandler;
export { EntityTaskHandler, TripleTaskHandler };
