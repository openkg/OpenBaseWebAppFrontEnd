import { connect } from 'react-redux';
import { fetchQuestion, submitQuestion } from '../actions/question';
import Question from '../components/question';
import { getUserInfo } from '../actions/user';

const mapStatetoProps = state => ({
  questions: state.questions,
  result: state.result,
});

const mapDispatchToProps = dispatch => {
  return {
    fetchQuestion: token => {
      return dispatch(fetchQuestion(token));
    },
    submitQuestion: (answer, token) => {
      return dispatch(submitQuestion(answer, token));
    },
    getUserInfo: token => {
      return dispatch(getUserInfo(token));
    },
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(Question);
