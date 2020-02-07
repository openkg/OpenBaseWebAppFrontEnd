import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';

import MainContent from './container/index';
import Login from './pages/login';
import Register from './container/Register';
import Home from './pages/home';

import { Provider } from './components/common/context';
import AtlasList from './components/atlaslist';
import EditInfo from './container/EditInfo';
import BaseInfo from './container/BaseInfo';
import Search from './components/atlaslist/MapList';
import HotSearch from './components/home/HotSearch';
import Download from './components/Download/index';
import Question from './container/Question';
import AuditSumary from './container/AuditSumary';
import CheckSumary from './container/CheckSumary';
import CheckEntity from './container/CheckEntity';
import CheckRelationship from './container/CheckRelationship';
import AuditEntity from './container/AuditEntity';
import AuditRelationship from './container/AuditRelationship';
import BookmanInfo from './components/bookmanInfo';
import Users from './components/users';

@connect(null)
class Routers extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };
  render() {
    const { history, dispatch } = this.props;
    return (
      <Provider value={dispatch}>
        <Router history={history}>
          <Route>
            <IndexRoute component={Home} />
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/index" component={MainContent}>
              <IndexRoute component={BaseInfo} />
              <Route path="userinfo" component={BaseInfo} />
              <Route path="editUser" component={EditInfo} />
              <Route path="search" component={HotSearch} />
              <Route path="search/:keyword" component={HotSearch} />
              <Route path="download" component={Download} />
              <Route path="atlaslist" component={AtlasList} />
              <Route path="question" component={Question} />
              <Route path="auditsumary/:source" component={AuditSumary} />
              <Route path="checksumary" component={CheckSumary} />
              <Route path="checkentity" component={CheckEntity} />
              <Route path="checkentity/:jobId" component={CheckEntity} />
              <Route path="checkRelationship" component={CheckRelationship} />
              <Route path="checkRelationship/:jobId" component={CheckRelationship} />
              <Route path="auditEntity" component={AuditEntity} />
              <Route path="auditEntity/:jobId" component={AuditEntity} />
              <Route path="auditRelationship" component={AuditRelationship} />
              <Route path="auditRelationship/:jobId" component={AuditRelationship} />
              <Route path="atlaslist/:id" component={BookmanInfo} />
              <Route path="users" component={Users} />
            </Route>
            <Route path="*" component={Home} />
          </Route>
        </Router>
      </Provider>
    );
  }
}
export default Routers;
