import React from 'react';
import { redirect } from '../../utils/history';
import Header from '../../components/home/Header';
import Introduce from '../../components/home/Introduce';
import Feature from '../../components/home/Feature';
import HotSearch from '../../components/home/HotSearch';
import Download from '../../components/Download';
import UseCase from '../../components/home/UseCase';
import Volunteer from '../../components/home/Volunteer';
import Community from '../../components/home/Community';
import Footer from '../../components/home/Footer';
import LoginForm from '../../components/common/LoginForm';
import { withDispatch } from '../../components/common/context';
import { getUserInfo } from '../../utils/localData';
import './index.scss';

@withDispatch
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginForm: false,
    };
  }
  showLogin = () => {
    this.setState({ loginForm: true });
  };
  goRegister = () => {
    redirect('/register');
  };
  handleClick() {
    this.setState({
      loginForm: false,
    });
  }
  render() {
    const userinfo = getUserInfo(false);
    const { history, dispatch } = this.props;
    return (
      <div className="main-container">
        <section className="content-wrapper responsive">
          <Header userinfo={userinfo} handleLogin={this.showLogin} handleRegister={this.goRegister} />
        </section>
        <section className="content-wrapper">
          <Introduce />
        </section>
        <section className="content-wrapper">
          <Feature />
        </section>
        <section className="content-wrapper search-container">
          <div className="part-title">
            <img src="https://qiniu.ruyi.ai/explore.svg" width="36" height="36" alt="explore" />
            <span>热门搜索</span>
          </div>
          <HotSearch />
        </section>
        <section className="content-wrapper dowload">
          <div className="part-title">
            <img src="https://qiniu.ruyi.ai/explore.svg" width="36" height="36" alt="explore" />
            <span>图谱下载</span>
          </div>
          <Download showTitle={false} />
        </section>
        <section className="content-wrapper">
          <UseCase />
        </section>
        <section className="content-wrapper" style={{ height: 'auto' }}>
          <Volunteer />
        </section>
        <section className="content-wrapper community">
          <Community />
        </section>
        <div className="join-btn" onClick={this.goRegister}>
          立即加入
        </div>
        <Footer />
        {this.state.loginForm && (
          <div
            className="pop-mask"
            onClick={() => {
              this.handleClick();
            }}
          >
            <LoginForm dispatch={dispatch} history={history} />
          </div>
        )}
      </div>
    );
  }
}

export default Home;
