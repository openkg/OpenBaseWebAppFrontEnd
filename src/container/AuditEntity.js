import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuditEntity from '../components/entity/AuditEntity';
import { getAuditTask, continueAuditTask, saveAuditTask, commitAuditTask } from '../actions/task';

const mapStatetoProps = state => {
  const data = state.tasks || {};
  const elements = (data.elements || []).map((item, index) => {
    return {
      order: index,
      subjectId: item.subjectId,
      name: item.subject,
      sumary: item.description,
      reviewedRes: item.reviewedRes,
    };
  });
  return {
    jobId: data.jobId,
    jobStatus: data.jobStatus,
    currentPage: data.currentPage,
    reviewSpan: data.reviewSpan,
    elements,
    source: state.sumary.source,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    ACTIONS: bindActionCreators(
      {
        getAuditTask,
        continueAuditTask,
        saveAuditTask,
        commitAuditTask,
      },
      dispatch
    ),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(AuditEntity);
