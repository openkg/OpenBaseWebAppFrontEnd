import React from 'react';

import CSSModules from 'react-css-modules';
import Logo from '../../components/common/Logo';
import Select from '../../components/common/Select';
import styles from './index.scss';
import Copyright from '../../components/Copyright';
// import { Form } from '../../components/common/form/Form'
import { Form } from 'react-html5-form';
import TextInput from '../../components/common/form/Input';
import LoginForm from '../../components/common/LoginForm';
import { withDispatch } from '../../components/common/context';
import Button from '../../components/common/Button';
import { showDialog } from '../../utils';
import { getCode } from '../../services/user';

@withDispatch
@CSSModules(styles)
class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      password: '',
      repassword: '',
      mobile: '',
      smscode: '',
      email: '',
      organization: '',
      skilled: '',
      loginForm: false,
      openCopyright: false,
      agree: false,
      counter: -1,
    };
  }
  componentDidMount() {
    /* eslint {"no-new": "off", "no-undef": "off"} */
    new TencentCaptcha(document.getElementById('TencentCaptchaBtn'), 'APPID', res => {
      // replace APPID with your own tencent captcha appid
      this.getCode(window.form, res.ticket, res.randstr);
    });
  }
  componentWillUnmount() {
    delete window.form;
  }
  onClose = () => {
    this.setState({ loginForm: false });
  };
  // onPasswordChange = () => { };
  getCode = (form, ticket, randstr) => {
    const { mobile, counter } = this.state;
    const valid = form.state.inputGroups[3].checkValidityAndUpdate();
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
  showLogin = () => {
    this.setState({ loginForm: true });
  };
  submit = () => {
    const { handleRegister } = this.props;
    const param = { ...this.state };
    if (param.skilled) {
      param.skilled = param.skilled.split(',');
    }
    handleRegister(param).then(data => {
      if (data.code !== 0) {
        showDialog({ content: data.msg });
      }
    });
  };
  toggleCopyright = () => {
    const { openCopyright } = this.state;
    this.setState({ openCopyright: !openCopyright });
  };
  handleCheck = e => {
    const { checked } = e.target;
    this.setState({ agree: checked });
  };
  handleClick() {
    this.setState({
      loginForm: false,
    });
  }

  render() {
    const { volunteer, editCounts, atlas } = this.props;
    const options = [
      { text: '金融', value: '金融' },
      { text: '人工智能', value: '人工智能' },
      { text: '计算机', value: '计算机' },
      { text: '医疗', value: '医疗' },
      { text: '农业', value: '农业' },
    ];
    const { fullname, password, repassword, mobile, smscode, email, organization, skilled, openCopyright, agree, error, counter } = this.state;
    const { history, dispatch } = this.props;
    return (
      <React.Fragment>
        <div styleName="register" className="mainContent">
          <div styleName="left-panel">
            <Logo />
            <h5>至今为止，openbase已有</h5>
            <ul>
              <li>
                <span styleName="number">{volunteer}</span>
                <span>位志愿者</span>
              </li>
              <li>
                <span styleName="number">{editCounts}</span>
                <span>次编辑</span>
              </li>
              <li>
                <span styleName="number">{atlas}</span>
                <span>万图谱数据</span>
              </li>
            </ul>
          </div>
          <div styleName="right-panel">
            <Form onSubmit={this.submit} styleName="form">
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
                    <h5>如果您还没有加入我们，请先注册吧</h5>
                    <ul>
                      <li>
                        <TextInput
                          label="姓名："
                          name="fullname"
                          maxLength="4"
                          placeholder="请输入您的真实姓名"
                          valueMissing="请输入您的真实姓名"
                          defaultValue={fullname}
                          wrapCls={styles.item}
                          onChange={e => this.setState({ fullname: e.target.value })}
                        />
                      </li>
                      <li>
                        <TextInput
                          label="密码："
                          name="password"
                          type="password"
                          minLength="6"
                          wrapCls={styles.item}
                          placeholder="请输入密码"
                          valueMissing="请输入密码"
                          tooShort="密码太短，最少为6位"
                          defaultValue={password}
                          onChange={e => this.setState({ password: e.target.value })}
                        />
                      </li>
                      <li>
                        <TextInput
                          label="密码确认："
                          name="password"
                          type="password"
                          minLength="6"
                          wrapCls={styles.item}
                          placeholder="请再次确认密码"
                          valueMissing="请再次确认密码"
                          tooShort="密码太短，最少为6位"
                          defaultValue={repassword}
                          onChange={e => this.setState({ repassword: e.target.value })} // eslint-disable-line
                        />
                      </li>
                      <li>
                        <TextInput
                          label="手机号："
                          name="mobile"
                          pattern="^1\d{10}$"
                          wrapCls={styles.item}
                          placeholder="请输入手机号"
                          valueMissing="请输入手机号"
                          patternMismatch="输入不正确，请重新输入"
                          maxLength="11"
                          defaultValue={mobile}
                          onChange={e => this.setState({ mobile: e.target.value })}
                        />
                      </li>
                      <li>
                        <TextInput
                          label="填写验证码："
                          name="code"
                          wrapCls={styles.item}
                          placeholder="请输入验证码"
                          valueMissing="请输入验证码"
                          defaultValue={smscode}
                          onChange={e => this.setState({ smscode: e.target.value })}
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
                        <TextInput
                          label="邮箱："
                          name="email"
                          type="email"
                          wrapCls={styles.item}
                          placeholder="请输入邮箱"
                          valueMissing="请输入邮箱"
                          typeMismatch="输入不正确，请重新输入"
                          defaultValue={email}
                          onChange={e => this.setState({ email: e.target.value })}
                        />
                      </li>
                      <li>
                        <TextInput
                          label="学校／机构／公司："
                          name="organization"
                          wrapCls={styles.item}
                          placeholder="请输入学校/机构/公司"
                          valueMissing="请输入学校/机构/公司"
                          defaultValue={organization}
                          onChange={e => this.setState({ organization: e.target.value })} // eslint-disable-line
                        />
                      </li>
                      <li>
                        <div className={styles.item}>
                          <label>擅长领域：</label>
                          <Select multiple options={options} defaultValue={skilled} onChange={value => this.setState({ skilled: value })} />
                        </div>
                      </li>
                    </ul>
                    <div className={styles.footer}>
                      <div className={styles.tooltip}>
                        <label>
                          <input type="checkbox" onChange={this.handleCheck} />
                          <span>我已阅读</span>
                          <a onClick={this.toggleCopyright}>openbase加入协议</a>
                        </label>
                      </div>
                      <div className={styles['login-title']}>
                        <span>已有账号，请直接</span>
                        <span className={styles.login} onClick={this.showLogin}>
                          登录
                        </span>
                      </div>
                    </div>
                    <div className={styles.submit}>
                      {error && <p className="error">{error}</p>}
                      <Button disabled={!agree}>注册</Button>
                    </div>
                  </React.Fragment>
                );
              }}
            </Form>
          </div>
        </div>
        {this.state.loginForm && (
          <div
            className="pop-mask"
            onClick={() => {
              this.handleClick();
            }}
          >
            <LoginForm dispatch={dispatch} history={history} onClose={this.onClose} />
          </div>
        )}
        {openCopyright && <Copyright onSubmit={() => this.toggleCopyright(false)} />}
      </React.Fragment>
    );
  }
}
export default Index;
