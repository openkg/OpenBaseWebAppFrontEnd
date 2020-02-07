import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './Timer.scss';

let timeSpan = 0;
@CSSModule(styles, { allowMultiple: true })
class Timer extends React.PureComponent {
  static stop = () => {
    clearInterval(this.timerid);
  };
  static getTimeSpan = () => {
    return timeSpan;
  };
  constructor(props) {
    super(props);
    this.state = {
      time: '',
    };
    this.timeSpan = 0;
    this.startTime = +new Date();
  }
  componentDidMount() {
    timeSpan = 0;
    this.run();
  }
  componentWillUnmount() {
    clearInterval(this.timerid);
  }
  getTime = (startTime, currentTime) => {
    const times = (currentTime - startTime) / 1000;
    const hours = Math.floor(times / 3600)
      .toString()
      .padStart(2, '0');
    const mins = Math.floor((times / 60) % 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(times % 60)
      .toString()
      .padStart(2, '0');

    timeSpan = times;
    return [hours, mins, seconds].join(':');
  };
  run = () => {
    this.timerid = setInterval(() => {
      const currentTime = +new Date();
      const time = this.getTime(this.startTime, currentTime);
      this.setState({ time });
    }, 1000);
  };
  render() {
    const { className } = this.props;
    return (
      <span styleName="timer" className={className}>
        <i styleName="icon-clock" />
        {this.state.time}
      </span>
    );
  }
}
export default Timer;
