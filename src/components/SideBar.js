import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getUserInfo } from '../utils/localData';
import Logo from './common/Logo';
import { getMenus } from '../config/menus';
import CSSModules from 'react-css-modules';
import styles from './SideBar.scss';
import avatar from '../assets/images/avatar.svg';

const roleMap = {
  1: '超级管理员',
  2: '审核员',
  3: '验收员',
  4: '游客',
};
const mapStatetoProps = state => ({
  userinfo: state.userinfo,
});
@connect(mapStatetoProps)
@CSSModules(styles, { allowMultiple: true })
class SideBar extends React.PureComponent {
  render() {
    const { userinfo = {} } = this.props;
    console.log(this.props.userinfo);
    console.log(getUserInfo(false));
    const user = Object.assign({}, userinfo, getUserInfo(false));
    console.log(user);
    const { role = [5], fullname = '游客', headPortrait = avatar } = user;
    console.log(role);

    return (
      <div styleName="sidebar">
        <Logo />
        <div styleName="userinfo">
          <img src={headPortrait} styleName="user-portrait" />
          <span styleName="user-name">{fullname}</span>
          <span styleName="user-position">{role.map(key => roleMap[key]).join(',')}</span>
        </div>
        <div styleName="menus">
          <ul>
            {getMenus(role).map(item => {
              let subLinks = null;
              const itemClass = item.className ? styles[item.className] : '';
              if (item.subitems && item.subitems.length > 0) {
                subLinks = (item.subitems || []).map(subitem => {
                  const className = subitem.className ? styles[subitem.className] : '';
                  let { path } = subitem;
                  if (item.title === '验收图谱' && !role.includes('3') && !role.includes(3)) {
                    path = '/index/question';
                  }
                  return (
                    <li key={Math.random()} styleName="subitem" className={className}>
                      <Link to={path} activeClassName={styles.active}>
                        {subitem.title}
                      </Link>
                    </li>
                  );
                });
                subLinks = <ul>{subLinks}</ul>;
              }
              return (
                <li key={Math.random()} styleName="item" className={itemClass}>
                  <Link to={item.path} activeClassName={styles.active}>
                    {item.title}
                  </Link>
                  {subLinks}
                </li>
              );
            })}
          </ul>
        </div>
        {this.props.children}
      </div>
    );
  }
}
export default SideBar;
