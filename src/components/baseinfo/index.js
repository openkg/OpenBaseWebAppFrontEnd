import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './index.scss';
import Button from '../common/Button';
import message from '../common/Message';
import { redirect } from '../../utils/history';
import { getToken } from '../../utils/localData';

@CSSModule(styles)
class BaseInfo extends React.PureComponent {
  componentDidMount() {
    message.loading(true);
    const { getUserInfo } = this.props;
    const token = getToken();
    if (!token || token === '') {
      sessionStorage.clear();
      redirect('/');
      return;
    }
    console.log(getUserInfo);
    getUserInfo(token)
      .then(data => {
        console.log(data, 'fuck');
        // 登陆超时
        if (!data || data.code === 2) {
          sessionStorage.clear();
          redirect('/');
        }
        message.loading(false);
      })
      .catch(error => {
        message.loading(false);
        console.log(error);
      });
  }
  beginEdit = () => {
    redirect('/index/editUser');
  };
  logout = () => {
    const { logout } = this.props;
    const token = getToken();
    logout(token).then(() => {
      sessionStorage.clear();
      redirect('/');
    });
  };
  render() {
    const { fullname, mobile, email, organization, skilled, headPortrait } = this.props.userinfo;
    return (
      <div styleName="baseinfo">
        <h5 styleName="title">用户信息</h5>
        <div styleName="content">
          <div styleName="left-panel">
            <div styleName="item">
              <label>姓名：</label>
              <span styleName="text">{fullname}</span>
            </div>
            <div styleName="item">
              <label>手机号：</label>
              <span styleName="text">{mobile}</span>
            </div>
            <div styleName="item">
              <label>邮箱：</label>
              <span styleName="text">{email}</span>
            </div>
            <div styleName="item">
              <label>学校／机构／公司：</label>
              <span styleName="text">{organization}</span>
            </div>
            <div styleName="item">
              <label>擅长领域：</label>
              <span styleName="text">{skilled}</span>
            </div>
          </div>
          <div styleName="right-panel">
            <img src={headPortrait} data-src={`${headPortrait}`} styleName="user-portrait" />
            <span styleName="text">{fullname}</span>
          </div>
        </div>
        <div styleName="footer">
          <Button onClick={this.beginEdit}>编辑</Button>
          <Button onClick={this.logout} styleClass="border">
            退出
          </Button>
        </div>
      </div>
    );
  }
}
export default BaseInfo;
