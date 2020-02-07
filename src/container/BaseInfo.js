import { connect } from 'react-redux';
import BaseInfo from '../components/baseinfo';
import { getUserInfo, logout } from '../actions/user';

const mapStatetoProps = state => ({
  userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => {
  return {
    getUserInfo: token => {
      return dispatch(getUserInfo(token));
    },
    logout: token => {
      return dispatch(logout(token));
    },
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(BaseInfo);
