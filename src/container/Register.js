import { connect } from 'react-redux';
import Register from '../pages/register';
import { register } from '../actions/user';

const mapStatetoProps = state => ({
  volunteer: 77,
  editCounts: 2778,
  atlas: 13.3,
  userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => {
  return {
    handleRegister: param => {
      return dispatch(register(param));
    },
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(Register);
