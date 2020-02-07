import { connect } from 'react-redux';
import { fetchCheckRecord as fetchRecord } from '../actions/sumary';
import Sumary from '../components/sumary';
import { getCheckTask as getTasks, continueCheckTask as continueTasks } from '../actions/task';
import { bindActionCreators } from 'redux';

const status = {
  0: '验收中',
  1: '验收完成',
};
const mapStatetoProps = state => {
  const sumary = state.sumary || {};
  const data = sumary.data || {};
  const items = (data.acceptanceRecord || data.reviewRecord || []).map(item => {
    const hours = Math.floor(item.reviewSpan / 60);
    const mins = item.reviewSpan % 60;
    return {
      jobId: item.jobId,
      date: item.startTime,
      timeSpan: item.reviewSpan > 60 ? `${hours}小时${mins}分钟` : `${item.reviewSpan}分钟`,
      statusId: item.jobStatus,
      StatusText: status[item.jobStatus],
      action: item.jobStatus === 0 ? '点击验收' : '查看',
    };
  });
  return {
    action: '验收',
    entityNum: data.acceptancedEntityNum,
    tripleNum: data.acceptancedTripleNum,
    timeSpan: Math.ceil(data.acceptanceTimeSpan || 0),
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
      },
      dispatch
    ),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(Sumary);
