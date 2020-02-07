import request from '../utils/request';

export const FETCH_QUESTION = 'FETCH_QUESTION';
export const FETCH_QUESTION_SUCCESS = 'FETCH_QUESTION_SUCCESS';
export const FETCH_QUESTION_FAILED = 'FETCH_QUESTION_FAILED';
export const SUBMIT_QUESTION_SUCCESS = 'SUBMIT_QUESTION_SUCCESS';

export const fetchStart = () => ({
  type: FETCH_QUESTION,
});

export const fetchQuestionSuccess = result => ({
  type: FETCH_QUESTION_SUCCESS,
  result,
});

export const submitQuestionSuccess = result => ({
  type: SUBMIT_QUESTION_SUCCESS,
  result,
});

export const fetchQuestionFailure = error => ({
  type: FETCH_QUESTION_FAILED,
  error,
});

export const fetchQuestion = token => {
  return dispatch => {
    dispatch(fetchStart());
    return request('/user/getQuestion', { token })
      .then(data => {
        dispatch(fetchQuestionSuccess(data));
        return data;
      })
      .catch(error => {
        dispatch(fetchQuestionFailure(error));
      });
  };
};

export const submitQuestion = (answer, token) => {
  return dispatch => {
    return request('/user/check', { answer, token }, { method: 'POST' })
      .then(data => {
        dispatch(submitQuestionSuccess(data));
        return data;
      })
      .catch(error => {
        dispatch(fetchQuestionFailure(error));
      });
  };
};
