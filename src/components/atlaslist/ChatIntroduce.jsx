import React from 'react';
import { connect } from 'react-redux';
import CSSModule from 'react-css-modules';
import styles from './chatIntroduce.scss';
import { sendMessage } from '../../actions/chat';

const tips = [
  '怎么联系熊智华老师？',
  '杜小勇老师有多少出版物？',
  '黄民烈现在什么职称？',
  '你认识谭铁牛吗？',
  '李涓子老师做什么领域的？',
  '刘挺现在哪里搞学术？',
  '反馈机制领域有什么人？',
  '那机器学习呢？',
];
const mapDispatchToProps = dispatch => {
  return {
    sendTipsMsg(msg) {
      dispatch(sendMessage(msg));
    },
  };
};

@connect(null, mapDispatchToProps)
@CSSModule(styles, { allowMultiple: true })
class ChatIntroduce extends React.PureComponent {
  onClick(msg) {
    const { sendTipsMsg } = this.props;
    sendTipsMsg({
      content: msg,
    });
  }

  render() {
    return (
      <li styleName="tips-box">
        <span styleName="icon-figure" />
        <div styleName="main">
          <div styleName="tips-head">Hi 我是基于KG4AI知识图谱产生的智能问答机器人，你可以这样问我：</div>
          {tips.map(msg => (
            <div
              styleName="tips-msg"
              onClick={() => {
                this.onClick(msg);
              }}
              key={msg}
            >
              {msg}
            </div>
          ))}
        </div>
      </li>
    );
  }
}

export default ChatIntroduce;
