import { connect } from 'react-redux';
import { fetchRecord, updateSource } from '../actions/sumary';
import { getAuditTask as getTasks, continueAuditTask as continueTasks } from '../actions/task';
import Sumary from '../components/sumary';
import { bindActionCreators } from 'redux';

const status = {
  0: '审核中',
  1: '审核完成',
};
const mapStatetoProps = state => {
  const sumary = state.sumary || {};
  const data = sumary.data || {};
  const items = (data.reviewRecord || []).map(item => {
    const hours = Math.floor(item.reviewSpan / 60);
    const mins = item.reviewSpan % 60;
    return {
      jobId: item.jobId,
      date: item.startTime,
      timeSpan: item.reviewSpan > 60 ? `${hours}小时${mins}分钟` : `${item.reviewSpan}分钟`,
      statusId: item.jobStatus,
      StatusText: status[item.jobStatus],
      action: item.jobStatus === 0 ? '点击审核' : '查看',
    };
  });
  return {
    action: '审核',
    total: data.total,
    finished: data.finished,
    entityNum: data.reviewedEntityNum,
    tripleNum: data.reviewedTripleNum,
    timeSpan: Math.ceil(data.reviewTimeSpan || 0),
    history: items,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ACTIONS: bindActionCreators(
      {
        fetchRecord,
        getTasks,
        continueTasks,
        updateSource,
      },
      dispatch
    ),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(Sumary);
