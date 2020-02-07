import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class Index extends React.PureComponent {
  render() {
    return (
      <div styleName="app">
        <div>pages/main/index</div>
        <div styleName="content">{this.props.children}</div>
      </div>
    );
  }
}
export default Index;
