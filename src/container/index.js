import React from 'react';
import { connect } from 'react-redux';
import SideBar from '../components/SideBar';
import Loading from '../components/common/Loading';
import { CONTENT_STATUS } from '../actions/chat';
import { showLoading } from '../actions/root';
import CSSModules from 'react-css-modules';
import styles from './index.css';

const mapStateToProps = state => {
  const { loading } = state.root;
  const { contentStatus } = state.chat;
  return { contentStatus, loading };
};
const mapDispatchToProps = dispatch => {
  return {
    showLoading(loading) {
      dispatch(showLoading(loading));
    },
  };
};
@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles, { allowMultiple: true })
class Index extends React.PureComponent {
  render() {
    const { contentStatus, loading } = this.props;
    const isShowChat = contentStatus === CONTENT_STATUS.CONTENT_STATUS_OPEN;
    return (
      <div styleName="app">
        <SideBar />
        <div id="mainContent" styleName={`content ${isShowChat ? 'has-chat' : ''} `}>
          {this.props.children}
          <Loading loading={loading} />
        </div>
      </div>
    );
  }
}
export default Index;
