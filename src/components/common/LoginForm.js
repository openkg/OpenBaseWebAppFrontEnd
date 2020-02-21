import React from 'react';
import CSSModules from 'react-css-modules';

import { loginByAccount } from '../../actions/user';
import Logo from './Logo';
import styles from './LoginForm.scss';
import { history } from '../../Store';
import Input from './form/Input';
import { getCode } from '../../services/user';
import { Form } from 'react-html5-form';

@CSSModules(styles, { allowMultiple: true })
class LoginForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loginType: 1,
      username: '',
      password: '',
      mobile: '',
      smscode: '',
      counter: -1,
    };
  }
  componentWillUnmount() {
    delete window.form;
  }
  getCode = (form, ticket, randstr) => {
    const { mobile, counter } = this.state;
    const valid = form.state.inputGroups[0].checkValidityAndUpdate();
    if (!valid || counter > 0 || !ticket) {
      return;
    }
    this.countdown();

    getCode(mobile, ticket, randstr).then(data => {
      if (data.code !== 0) {
        form.setError(data.msg);
      }
    });
  };
  countdown = () => {
    const run = () => {
      const counter = this.state.counter >= 0 ? this.state.counter - 1 : 30;
      this.setState({ counter });

      const timerid = setTimeout(() => {
        if (counter <= 0) {
          clearTimeout(timerid);
        } else {
          run();
        }
      }, 1000);
    };
    run();
  };
  handleLogin = form => {
    const { dispatch } = this.props;
    const { loginType, username, password, mobile, smscode } = this.state;
    const param = loginType === 1 ? { user_mobile: username, user_password: password } : { user_mobile: mobile, user_smsverificationcode: smscode };

    const result = dispatch(loginByAccount(param));
    result.then(data => {
      if (data.code !== 0) {
        form.setError(data.msg);
      }
    });
  };
  goRegister = () => {
    const { onClose } = this.props;
    if (window.location.hash.indexOf('/register') > -1) {
      onClose();
    } else {
      history.push('/register');
    }
  };
  switchLogin = loginType => {
    this.setState({ loginType });
    if (loginType === 2) {
      requestAnimationFrame(() => {
        /* eslint {"no-new": "off", "no-undef": "off"} */
        new TencentCaptcha(document.getElementById('TencentCaptchaBtn'), 'APPID', res => {
          // replace APPID with your own tencent captch appid
          this.getCode(window.form, res.ticket, res.randstr);
        });
      });
    }
  };
  render() {
    const { counter } = this.state;
    return (
      <div
        styleName="login-wrap"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div styleName="header">
          <Logo />
          <div styleName="title-wrap">
            <div styleName="title">登录</div>
            <div styleName="subtitle">
              <span>openbase</span>
              <span styleName="split-line" />
              <span>通行证</span>
            </div>
          </div>
        </div>
        <div styleName="content">
          {this.state.loginType === 1 && (
            <Form onSubmit={this.handleLogin} styleName="login-form">
              {({ error, form }) => {
                return (
                  <React.Fragment>
                    {error && (
                      <p className={styles['invalid-wrap']}>
                        <i className={styles['icon-error']} />
                        <span className={styles.error}>{error}</span>
                      </p>
                    )}
                    <ul>
                      <li>
                        <Input
                          name="username"
                          placeholder="用户名"
                          className={styles.input}
                          inputIcon={styles.username}
                          form={form}
                          position="top"
                          valueMissing="请输入用户名"
                          wrapCls={`${styles.item}`}
                          onChange={e => this.setState({ username: e.target.value })} // eslint-disable-line
                        />
                      </li>
                      <li>
                        <Input
                          type="password"
                          name="password"
                          placeholder="密码"
                          className={styles.input}
                          inputIcon={styles.password}
                          form={form}
                          position="top"
                          valueMissing="请输入密码"
                          wrapCls={`${styles.item}`}
                          onChange={e => this.setState({ password: e.target.value })} // eslint-disable-line
                        />
                      </li>
                      <li>
                        <div className={styles.item}>
                          <input type="submit" className={styles.button} value="登录" />
                        </div>
                      </li>
                    </ul>
                    <div className={styles.buttons}>
                      <span className={styles.register} onClick={this.goRegister}>
                        立即注册
                      </span>
                      {
                        <span className={styles.login} onClick={() => this.switchLogin(2)}>
                          手机号登录
                        </span>
                      }
                    </div>
                  </React.Fragment>
                );
              }}
            </Form>
          )}
          {this.state.loginType === 2 && (
            <Form styleName="login-form" onSubmit={this.handleLogin}>
              {({ error, form }) => {
                window.form = form;
                return (
                  <React.Fragment>
                    {error && (
                      <p className={styles['invalid-wrap']}>
                        <i className={styles['icon-error']} />
                        <span className={styles.error}>{error}</span>
                      </p>
                    )}
                    <ul>
                      <li>
                        <Input
                          name="mobile"
                          placeholder="手机号"
                          className={styles.input}
                          form={form}
                          position="top"
                          valueMissing="请输入手机号"
                          wrapCls={`${styles.item}`}
                          onChange={e => this.setState({ mobile: e.target.value })} // eslint-disable-line
                        />
                      </li>
                      <li>
                        <Input
                          name="smscode"
                          placeholder="验证码"
                          form={form}
                          position="top"
                          valueMissing="请输入验证码"
                          wrapCls="code-wrap"
                          onChange={e => this.setState({ smscode: e.target.value })} // eslint-disable-line
                          child={
                            <button
                              id="TencentCaptchaBtn"
                              type="button"
                              disabled={counter > 0}
                              className={`${styles.code} ${counter > 0 ? styles.disabled : ''}`}
                            >
                              获取验证码{counter > 0 && <i>({counter})</i>}
                            </button>
                          }
                        />
                      </li>
                      <li>
                        <div className={styles.item}>
                          <input type="submit" className={styles.button} value="登录" />
                        </div>
                      </li>
                    </ul>
                    <div className={styles.buttons}>
                      <span className={styles.register} onClick={this.goRegister}>
                        立即注册
                      </span>
                      <span className={styles.login} onClick={() => this.switchLogin(1)}>
                        帐号密码登录
                      </span>
                    </div>
                  </React.Fragment>
                );
              }}
            </Form>
          )}
        </div>
      </div>
    );
  }
}
export default LoginForm;
