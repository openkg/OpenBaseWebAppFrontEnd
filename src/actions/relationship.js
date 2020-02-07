import request from '../utils/request';

export const FETCH_LIST = 'FETCH_LIST';
export const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS';
export const FETCH_LIST_FAILURE = 'FETCH_LIST_FAILURE';

export const fetchStart = () => ({
  type: FETCH_LIST,
});

export const fetchListSuccess = result => ({
  type: FETCH_LIST_SUCCESS,
  result,
});

export const fetchListFailure = error => ({
  type: FETCH_LIST_FAILURE,
  error,
});

export const fetchList = () => {
  return dispatch => {
    dispatch(fetchStart());
    return request('/relationships', {})
      .then(data => {
        dispatch(fetchListSuccess(data));
      })
      .catch(error => {
        dispatch(fetchListFailure(error));
      });
  };
};
