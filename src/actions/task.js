import request from '../utils/request';

export const GET_AUDIT_TASK_SUCCESS = 'GET_AUDIT_TASK_SUCCESS';
export const GET_AUDIT_TASK_FAILURE = 'GET_AUDIT_TASK_FAILURE';
export const SAVE_AUDIT_TASK_SUCCESS = 'SAVE_AUDIT_TASK_SUCCESS';
export const COMMIT_AUDIT_TASK_SUCCESS = 'COMMIT_AUDIT_TASK_SUCCESS';
export const CONTINUE_AUDIT_TASK_SUCCESS = 'CONTINUE_AUDIT_TASK_SUCCESS';

export const GET_CHECK_TASK_SUCCESS = 'GET_CHECK_TASK_SUCCESS';
export const CONTINUE_CHECK_TASK_SUCCESS = 'CONTINUE_CHECK_TASK_SUCCESS';
export const SAVE_CHECK_TASK_SUCCESS = 'SAVE_CHECK_TASK_SUCCESS';
export const COMMIT_CHECK_TASK_SUCCESS = 'COMMIT_CHECK_TASK_SUCCESS';

export const getAuditTaskSuccess = result => ({
  type: GET_AUDIT_TASK_SUCCESS,
  result,
});
export const continueAuditTaskSuccess = result => ({
  type: CONTINUE_AUDIT_TASK_SUCCESS,
  result,
});
export const saveAuditTaskSuccess = result => ({
  type: SAVE_AUDIT_TASK_SUCCESS,
  result,
});
export const commitAuditTaskSuccess = result => ({
  type: COMMIT_AUDIT_TASK_SUCCESS,
  result,
});

export const getCheckTaskSuccess = result => ({
  type: GET_CHECK_TASK_SUCCESS,
  result,
});
export const continueCheckTaskSuccess = result => ({
  type: CONTINUE_CHECK_TASK_SUCCESS,
  result,
});
export const saveCheckTaskSuccess = result => ({
  type: SAVE_CHECK_TASK_SUCCESS,
  result,
});
export const commitCheckTaskSuccess = result => ({
  type: COMMIT_CHECK_TASK_SUCCESS,
  result,
});

export const getAuditTaskFailure = error => ({
  type: GET_AUDIT_TASK_FAILURE,
  error,
});

/**
 * 获取审核任务的列表，返回实体和关系等列表信息
 * @param {String} token
 */
export const getAuditTask = ({ token, source = 'kg4ai' }) => {
  return dispatch => {
    return request('/review/getTask', { token, source })
      .then(data => {
        dispatch(getAuditTaskSuccess(data));
        return data;
      })
      .catch(error => {
        dispatch(getAuditTaskFailure(error));
      });
  };
};

/**
 * 继续审核 - 获取未完成的审核任务列表
 * @param {String} token
 * @param {Number} jobId
 */
export const continueAuditTask = ({ token, jobId, source = 'kg4ai' }) => {
  return dispatch => {
    return request('/review/continueTask', { token, jobId, source }).then(data => {
      dispatch(continueAuditTaskSuccess(data));
      return data;
    });
  };
};

/**
 * 保存审核任务
 * @param {Object} param0，包含token, jobId, currentPage, reviewSpan, data等字段
 */
export const saveAuditTask = data => {
  return dispatch => {
    return request('/review/saveTask', data, { method: 'POST' }).then(data => {
      dispatch(saveAuditTaskSuccess(data));
      return data;
    });
  };
};

/**
 * 提交审核任务
 * @param {Object} param0，包含token, jobId, currentPage, reviewSpan, data等字段
 */
export const commitAuditTask = data => {
  return dispatch => {
    return request('/review/commitTask', data, { method: 'POST' }).then(data => {
      dispatch(commitAuditTaskSuccess(data));
      return data;
    });
  };
};

/**
 * 获取验收任务的列表，返回实体和关系等列表信息
 * @param {String} token
 */
export const getCheckTask = ({ token, source = 'kg4ai' }) => {
  return dispatch => {
    return request('/acceptance/getTask', { token, source }).then(data => {
      dispatch(getCheckTaskSuccess(data));
      return data;
    });
  };
};

/**
 * 继续验收 - 获取未完成的验收任务列表
 * @param {String} token
 * @param {Number} jobId
 */
export const continueCheckTask = ({ token, jobId, source = 'kg4ai' }) => {
  return dispatch => {
    return request('/acceptance/continueTask', { token, jobId, source }).then(data => {
      dispatch(continueCheckTaskSuccess(data));
      return data;
    });
  };
};
/**
 * 保存验收任务
 * @param {Object} param0，包含token, jobId, currentPage, acceptanceSpan, data等字段
 */
export const saveCheckTask = data => {
  return dispatch => {
    return request('/acceptance/saveTask', data, { method: 'POST' }).then(data => {
      dispatch(saveCheckTaskSuccess(data));
      return data;
    });
  };
};

/**
 * 提交验收任务
 * @param {Object} param0
 */
export const commitCheckTask = data => {
  return dispatch => {
    return request('/acceptance/commitTask', data, { method: 'POST' }).then(data => {
      dispatch(commitCheckTaskSuccess(data));
      return data;
    });
  };
};
