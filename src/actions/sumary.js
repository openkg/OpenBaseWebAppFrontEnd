import request from '../utils/request';

export const FETCH_RECORD_SUCCESS = 'FETCH_RECORD_SUCCESS';
export const UPDATE_SOURCE = 'UPDATE_SOURCE';

export const fetchRecordSuccess = result => ({
  type: FETCH_RECORD_SUCCESS,
  result,
});

export const fetchRecord = ({ token, source }) => {
  return dispatch => {
    return request('/review/getStats', { token, source }).then(data => {
      dispatch(fetchRecordSuccess(data));
      return data;
    });
  };
};

export const fetchCheckRecord = ({ token, source }) => {
  return dispatch => {
    return request('/acceptance/getStats', { token, source }).then(data => {
      dispatch(fetchRecordSuccess(data));
      return data;
    });
  };
};

export const updateSource = source => {
  return dispatch => {
    dispatch({ type: UPDATE_SOURCE, source });
  };
};
