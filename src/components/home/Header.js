import React from 'react';
import { Link } from 'react-router';

const Header = props => {
  const { handleLogin, handleRegister } = props;
  let { userinfo } = props;
  userinfo = userinfo || {};
  return (
    <div className="content part-one">
      <div className="header">
        <img src="https://qiniu.ruyi.ai/logo.svg" width="35" height="35" alt="logo" />
        <span className="title">OpenBase</span>
        {userinfo.fullname && (
          <Link className="logo-info" to="/index">
            <img src={userinfo.headPortrait} className="user-portrait" />
            <span className="text">{userinfo.fullname}</span>
          </Link>
        )}
        {!userinfo.fullname && (
          <React.Fragment>
            <a className="opr-btn" onClick={handleRegister}>
              注册
            </a>
            <a className="opr-btn" onClick={handleLogin}>
              登录
            </a>
          </React.Fragment>
        )}
      </div>
      <div className="des">
        <h1>OpenBase</h1>
        <p>中文开放域高质量免费知识图谱</p>
      </div>
    </div>
  );
};

export default Header;
