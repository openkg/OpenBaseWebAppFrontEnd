import React from 'react';
import { Link } from 'react-router';
import CSSmodule from 'react-css-modules';
import styles from './Logo.css';

const logo = require('../../assets/images/icon-logo.png');

@CSSmodule(styles)
class Logo extends React.Component {
  render() {
    return (
      <div styleName="logo-wrap" className={this.props.className}>
        <Link to="/">
          <img styleName="logo-img" src={logo} />
          <span styleName="logo-title">OpenBase</span>
        </Link>
      </div>
    );
  }
}
export default Logo;
