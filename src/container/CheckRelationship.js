import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Relationship from '../components/relationship/index';
import {
  getCheckTask as getTask,
  continueCheckTask as continueTask,
  saveCheckTask as saveTask,
  commitCheckTask as commitTask,
} from '../actions/task';

const mapStatetoProps = state => {
  const data = state.tasks || {};
  const elements = (data.elements || []).map((item, index) => {
    return {
      order: index,
      subjectId: item.subjectId,
      name: item.subject,
      sumary: item.sumary,
      acceptanceRes: item.acceptanceRes,
      reviewedRes: item.reviewedRes,
      triples: item.triples,
    };
  });
  return {
    action: '验收',
    jobId: data.jobId,
    jobStatus: data.jobStatus,
    currentPage: data.currentPage,
    reviewSpan: data.reviewSpan,
    elements,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    ACTIONS: bindActionCreators(
      {
        getTask,
        continueTask,
        saveTask,
        commitTask,
      },
      dispatch
    ),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(Relationship);
