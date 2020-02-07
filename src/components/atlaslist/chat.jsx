import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CSSModule from 'react-css-modules';
import { chatLogin, sendMessage, setChatStatus, CHAT_STATUS, CONTENT_STATUS, setContentStatus } from '../../actions/chat';
import styles from './chat.scss';
import ChatIntroduce from './ChatIntroduce';
import user from '../../utils/localData';

const mapStateToProps = state => {
  const { messages, chatStatus } = state.chat;
  return {
    messages,
    chatStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ACTIONS: bindActionCreators(
      {
        chatLogin,
        sendMessage,
        setChatStatus,
        setContentStatus,
      },
      dispatch
    ),
  };
};
@connect(mapStateToProps, mapDispatchToProps)
@CSSModule(styles, { allowMultiple: true })
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidUpdate() {
    const box = this.ref.current;
    const { scrollHeight } = box;
    box.scrollTo(0, scrollHeight);
  }

  handleClick() {
    const { setChatStatus, setContentStatus } = this.props.ACTIONS;
    setChatStatus({
      CHAT_STATUS: CHAT_STATUS.CHAT_STATUS_CLOSE,
    });
    setContentStatus({
      payload: CONTENT_STATUS.CONTENT_STATUS_CLOSE,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const $form = e.target;
    const { sendMessage } = this.props.ACTIONS;
    let { value } = $form.content;
    $form.content.value = '';
    value = value.trim();
    if (!value) {
      return;
    }
    sendMessage({
      content: value,
    });
  }

  render() {
    const { messages } = this.props;
    const { headPortrait } = user.userInfo(false) || {};

    return (
      <div styleName="chat" className="mg-scrollbar">
        <div styleName="head">
          <div
            styleName="switch-box"
            onClick={() => {
              this.handleClick();
            }}
          >
            <span styleName="text">收起</span>
            <span styleName="icon-switch" />
          </div>
          <h4>KG4AI问答机器人</h4>
        </div>
        <ul styleName="chat-box" ref={this.ref}>
          <ChatIntroduce />
          {messages &&
            messages.map(item => (
              <li styleName={`chat-item ${item.self === 1 ? 'client' : 'robot'}`} key={Math.random() + item.date}>
                <div styleName="main">
                  <span styleName="icon-figure" style={item.self === 1 ? { backgroundImage: `url(${headPortrait})` } : {}} />
                  <p>{item.content.replace(/\\n/gi, ' ')}</p>
                </div>
              </li>
            ))}
        </ul>

        <form styleName="send" onSubmit={e => this.handleSubmit(e)}>
          <input type="text" name="content" autoComplete="off" />
          <input type="submit" name="submit" value="发送" />
        </form>
      </div>
    );
  }
}

export default Chat;
