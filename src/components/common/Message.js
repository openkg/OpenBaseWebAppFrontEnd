import React from 'react';
import ReactDOM from 'react-dom';
import CSSModule from 'react-css-modules';
import styles from './Message.scss';

@CSSModule(styles, { allowMultiple: true })
class Message extends React.Component {
  static newInstance(props, callback) {
    const { getContainer } = props;
    const id = 'mi-message-box';
    let div = document.getElementById(id);
    if (!div) {
      div = document.createElement('div');
      div.id = id;
      if (getContainer && getContainer()) {
        const root = getContainer();
        root.appendChild(div);
      } else {
        document.body.appendChild(div);
      }
    }

    let called = false;
    const ref = instance => {
      if (called) {
        return false;
      }
      called = true;
      return callback({
        component: instance,
        show(props) {
          instance.init(props);
        },
        close() {
          instance.close();
        },
        destroy() {
          ReactDOM.unmountComponentAtNode(div);
          div.parentNode && div.parentNode.removeChild(div) // eslint-disable-line
        },
      });
    };

    ReactDOM.render(<Message {...props} ref={ref} />, div);
  }
  constructor(props) {
    super(props);
    this.state = { instance: null };
  }
  init = props => {
    const { content } = props;
    const instance = <div className={styles.content}>{content}</div>;
    this.setState({ instance });
  };
  close() {
    this.setState({ instance: null });
  }
  render() {
    return this.state.instance;
  }
}
let messageInstance;
const getInstance = (props = {}, callback) => {
  Message.newInstance(props, instance => {
    messageInstance = instance;
    callback(instance);
  });
};
// const props = {
//   getContainer: () => {
//     const nodes = document.getElementById('mainContent')
//     return nodes
//   },
// }
// getInstance(props)

const notice = props => {
  if (!props.show && messageInstance) {
    messageInstance.destroy();
    return false;
  }

  const config = {
    getContainer: () => {
      const nodes = document.querySelector('.mainContent');
      return nodes;
    },
  };
  const instance = getInstance(config, instance => {
    instance.show(props);
  });
  return instance;
};

const message = {
  info: content => {
    return messageInstance.show({ content });
  },
  loading: show => {
    const visibility = show ? 'show' : 'hidden';
    const content = (
      <React.Fragment>
        <span className={`${styles['loading-wrap']} mg-center ${visibility}`}>
          <i /> <i /> <i /> <i />
        </span>
        <div className={`${styles.mask} ${visibility}`} />
      </React.Fragment>
    );

    const props = {
      content,
      show,
    };
    notice(props);
  },
};
export default message;
