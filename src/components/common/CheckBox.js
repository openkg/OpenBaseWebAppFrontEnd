import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './CheckBox.scss';

@CSSModule(styles, { allowMultiple: true })
class CheckBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
    };
  }
  onCheck = () => {
    const checked = !this.state.checked;
    const { onChange, value } = this.props;
    if (typeof onChange === 'function') {
      onChange({ checked, value });
    }
    this.setState({ checked });
  };
  render() {
    const checked = this.state.checked ? 'checked' : '';
    return <div styleName={`checkbox ${checked}`} onClick={this.onCheck} />;
  }
}
export default CheckBox;
