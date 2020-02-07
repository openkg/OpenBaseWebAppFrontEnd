import React from 'react';
import PropTypes from 'prop-types';

import { withDispatch } from '../../components/common/context';
import LoginForm from '../../components/common/LoginForm';

@withDispatch
class Home extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      loginForm: true,
    };
  }
  showLogin = () => {
    this.setState({ loginForm: true });
  };
  render() {
    const { history, dispatch } = this.props;
    return (
      <div className="home">
        <div className="pop">{this.state.loginForm ? <LoginForm dispatch={dispatch} history={history} /> : null}</div>
      </div>
    );
  }
}
export default Home;
