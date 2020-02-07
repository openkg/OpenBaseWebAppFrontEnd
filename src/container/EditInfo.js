import { connect } from 'react-redux';
import EditInfo from '../components/baseinfo/EditInfo';
import { getUserInfo, setUserInfo, uploadPicture } from '../actions/user';

const mapStatetoProps = state => ({
  userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => {
  return {
    getUserInfo: token => {
      return dispatch(getUserInfo(token));
    },
    setUserInfo: param => {
      dispatch(setUserInfo(param));
    },
    uploadPicture: param => {
      return dispatch(uploadPicture(param));
    },
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(EditInfo);
