import React from 'react';
import ReactDOM from 'react-dom';
import CSSmodule from 'react-css-modules';
import styles from './Dialog.scss';
import Button from './Button';

@CSSmodule(styles)
class Dialog extends React.Component {
  static newInstance(props, callback) {
    let div = document.getElementById('dialog-pop');
    if (!div) {
      div = document.createElement('div');
      div.id = 'dialog-pop';
      document.body.appendChild(div);
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
          div.parentNode.removeChild(div);
        },
      });
    };
    ReactDOM.render(<Dialog {...props} ref={ref} />, div);
  }
  constructor(props) {
    super(props);
    this.state = { Instance: null };
  }
  close = () => {
    this.setState({ Instance: null });
  };

  init = props => {
    const { title, content, btnText = '确定', canClose = false, onClose, onConfirm } = props;
    const instance = (
      <React.Fragment>
        <div className={styles['pop-mask']} />
        <div className={`${styles['dialog-wrap']} mg-center`}>
          {title && <div className={styles.header}>{title}</div>}
          <div className={styles.content}>{content}</div>
          <div className={styles.footer}>
            <Button onClick={onConfirm !== undefined ? onConfirm : onClose}>{btnText}</Button>
          </div>
          {canClose && (
            <i className={styles['icon-close']} onClick={onClose}>
              +
            </i>
          )}
        </div>
      </React.Fragment>
    );
    this.setState({ Instance: instance });
  };
  render() {
    const { Instance } = this.state;
    return Instance;
  }
}
export default Dialog;
