import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './index.scss';
import Dialog from '../common/Dialog';
import Button from '../common/Button';
import { getToken } from '../../utils/localData';
import { errorHandler, history } from '../../utils';
import { updateUserInfo } from '../../actions/user';
import { connect } from 'react-redux';

let modal = null;
Dialog.newInstance({}, instance => {
  modal = instance;
});

const mapStatetoProps = state => ({
  userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => {
  return {
    updateUser(payload) {
      dispatch(updateUserInfo(payload));
    },
  };
};
@connect(mapStatetoProps, mapDispatchToProps)
@CSSModule(styles, { allowMultiple: true })
class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      answer: {},
    };
  }
  componentDidMount() {
    const { fetchQuestion } = this.props;
    const token = getToken();
    fetchQuestion(token)
      .then(errorHandler)
      .then(data => {
        if (!data || data.code !== 0) {
          history.redirect('/');
        }
      });
  }
  checkAnswer = (number, option) => {
    const answer = Object.assign({}, this.state.answer);
    answer[number] = option;
    this.setState({ answer });
  };
  submit = () => {
    const token = getToken();
    const answers = [];
    const { answer } = this.state;
    Object.keys(answer).forEach(key => {
      answers.push({ result: answer[key].charCodeAt() - 64, number: key });
    });
    this.props.submitQuestion(answers, token).then(data => {
      if (data.code === 0) {
        const localUser = JSON.parse(sessionStorage.getItem('userInfo'));
        localUser.role.push('3');
        sessionStorage.setItem('userInfo', JSON.stringify(localUser));
        sessionStorage.setItem('role', `${sessionStorage.getItem('role')},3`);
        sessionStorage.setItem('token', data.token);
        this.props.updateUser({ role: sessionStorage.getItem('role').split(',') });
      }
      const { count, rightCount } = data.data;
      const percent = rightCount / count;
      let content = '';
      let btnText = '';
      let redirectUrl = '';
      if (data.code === 0) {
        btnText = '开始验收';
        content = `恭喜您成为OpenBase的验收者，您的成绩是${rightCount}/${count}，正确率为${percent * 100}%。`;
        redirectUrl = '/index/checkSumary';
      } else {
        btnText = '继续加油';
        content = `很遗憾，您的成绩是${rightCount}/${count}，成绩未达标，还不能成为验收者。`;
        redirectUrl = '/index';
      }

      modal.show({
        content,
        btnText,
        onClose: () => {
          modal.close();
          history.redirect(redirectUrl);
        },
      });
    });
  };
  renderOption = (option, id, text) => {
    const { answer } = this.state;
    return (
      <li styleName="option" onClick={() => this.checkAnswer(id, option)}>
        <input type="radio" name={`question_${id}`} value={option} defaultChecked={answer[id] === option} />
        <label>
          {option}、{text}
        </label>
      </li>
    );
  };
  render() {
    let { questions } = this.props.questions;
    questions = questions || [];
    return (
      <React.Fragment>
        <div styleName="container">
          <div styleName="header">
            <h5 styleName="title">验收者测试</h5>
            <h5 styleName="subtitle">以下测试题正确率达到90%及以上即可成为知识图谱 KG4AI 的验收者</h5>
          </div>
          <div styleName="questions" className="mg-scrollbar">
            {questions.map(item => {
              return (
                <div styleName="item" key={Math.random()}>
                  <p styleName="question">
                    {item.id} {item.title}
                  </p>
                  <ul styleName="options">
                    {this.renderOption('A', item.id, item.a)}
                    {this.renderOption('B', item.id, item.b)}
                    {this.renderOption('C', item.id, item.c)}
                    {this.renderOption('D', item.id, item.d)}
                  </ul>
                </div>
              );
            })}
          </div>
          <div styleName="footer">
            <Button onClick={this.submit}>提交</Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Index;
