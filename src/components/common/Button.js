import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './Button.scss';

@CSSModule(styles, { allowMultiple: true })
class Button extends React.PureComponent {
  onClick = e => {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(e);
    }
  };
  render() {
    const { children, styleClass = 'blue', className, disabled = false } = this.props;
    const styleNames = `button ${styleClass} ${disabled ? 'disabled' : ''}`;
    const props = {
      styleName: styleNames,
      className,
      onClick: this.onClick,
    };
    if (disabled) {
      props.disabled = true;
    } else {
      delete props.disabled;
    }
    return <button {...props}>{children}</button>;
  }
}
export default Button;
