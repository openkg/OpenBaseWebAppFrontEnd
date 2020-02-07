import React from 'react';
import { errorHandler, showDialog, history, localData } from '../../utils';

const EntityTaskComponent = (EntityComponent, newProps) => {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.props = props;
      this.role = localData.getRole();
      this.token = localData.getToken();
      this.jobId = props.params.jobId || null;
      this.jobStatus = props.jobStatus || 0;
      this.getTask = props.getTask;
      this.saveTask = props.ACTIONS.saveTask;
      this.commitTask = props.ACTIONS.commitTask;
      this.elements = props.elements || [];
      this.pageSize = props.pageSize || 9;
      this.responseHandler = props.responseHandler || (data => data);

      this.state = { displayItems: [] };
    }
    onPageChange = ({ pageIndex }) => {
      if (this.jobStatus === 0) {
        this.saveTask(pageIndex - 1);
      }
      this.setPageinfo({ pageIndex });
    };
    getParams = ({ currentPage, Timer }) => {
      console.log(currentPage, Timer);
    };
    setPageinfo = ({ pageIndex }) => {
      const size = this.pageSize;
      const items = this.elements.slice((pageIndex - 1) * size, pageIndex * size) // eslint-disable-line
      this.setState({ displayItems: items });
    };
    initData = () => {};
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
    render() {
      const props = Object.assign({}, this.props, newProps, {
        jobStatus: this.props.jobStatus,
        totalCount: this.props.elements.length,
        displayItems: this.state.displayItems,
        initPage: this.initPage,
        onCheck: this.onCheck,
        submitTask: this.submitTask,
      });
      return <EntityComponent {...props} />;
    }
  }
  return WrappedComponent;
};
export default EntityTaskComponent;
