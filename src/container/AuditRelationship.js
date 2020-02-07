import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Relationship from '../components/relationship/index';
import {
  getAuditTask as getTask,
  continueAuditTask as continueTask,
  saveAuditTask as saveTask,
  commitAuditTask as commitTask,
} from '../actions/task';

const mapStatetoProps = state => {
  const data = state.tasks || {};
  const elements = (data.elements || []).map((element, index) => {
    return {
      order: index,
      subjectId: element.subjectId,
      name: element.subject,
      sumary: element.sumary,
      reviewedRes: element.reviewedRes,
      acceptanceRes: element.acceptanceRes,
      triples: (element.triples || []).map(item => {
        const triple = Object.assign({}, item, { subject: element.subject });
        return triple;
      }),
    };
  });
  return {
    action: '审核',
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
