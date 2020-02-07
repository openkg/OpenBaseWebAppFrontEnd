import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CheckEntity from '../components/entity/CheckEntity';
import { getCheckTask, continueCheckTask, saveCheckTask, commitCheckTask } from '../actions/task';

const mapStatetoProps = state => {
  const data = state.tasks || {};
  const elements = (data.elements || []).map((item, index) => {
    return {
      order: index,
      subjectId: item.subjectId,
      name: item.subject,
      description: item.description,
      reviewedRes: item.reviewedRes,
      acceptanceRes: item.acceptanceRes,
      reviewedStatistics: item.reviewedStatistics,
    };
  });
  return {
    jobId: data.jobId,
    jobStatus: data.jobStatus,
    currentPage: data.currentPage,
    acceptanceSpan: data.acceptanceSpan,
    elements,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    ACTIONS: bindActionCreators(
      {
        getCheckTask,
        continueCheckTask,
        saveCheckTask,
        commitCheckTask,
      },
      dispatch
    ),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(CheckEntity);
