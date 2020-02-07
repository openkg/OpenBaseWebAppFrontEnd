import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './index.scss';
import Table from '../common/Table';
import Select from '../common/Select';
import message from '../common/Message';
import Pagination from '../common/Pagination';
import { getUsers, setUserRole } from '../../actions/user';
import { getToken } from '../../utils/localData';

const options = [
  { text: '超级管理员', value: '1' },
  { text: '审核员', value: '2' },
  { text: '验收员', value: '3' },
  { text: '游客', value: '4' },
];
const roleMap = {
  1: '超级管理员',
  2: '审核员',
  3: '验收员',
  4: '游客',
};

@CSSModule(styles, { allowMultiple: true })
class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      curEditRow: -1,
    };
    this.pageIndex = 1;
    this.pageSize = 20;
  }
  componentDidMount() {
    this.getList();
  }
  getList = (pageSize = this.pageSize, pageIndex = this.pageIndex) => {
    message.loading(true);
    const token = getToken();
    getUsers(token, pageSize, pageIndex)
      .then(data => {
        this.setState({ data });
        message.loading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };
  handlePaging = ({ pageSize, pageIndex }) => {
    this.getList(pageSize, pageIndex);
  };
  handleSelect = value => {
    this.curRole = value.toString().split(',');
    console.log(value);
  };
  beginEdit = (e, record) => {
    this.setState({ curEditRow: record.user_id });
  };
  saveChange = record => {
    const params = {
      token: getToken(),
      user_id: record.user_id,
      user_roles: this.curRole || record.user_roles,
    };
    setUserRole(params)
      .then(data => {
        if (data.code === 0) {
          this.getList();
        }
        this.setState({ curEditRow: -1 });
      })
      .catch(error => {
        this.setState({ curEditRow: -1 });
      });
  };
  render() {
    const { data, curEditRow } = this.state;
    const list = data.data || [];
    const { page = {} } = data;
    const totalCount = page.countTotal || 0;
    const columns = [
      {
        title: '姓名',
        name: 'user_fullname',
      },
      {
        title: '手机号码',
        name: 'user_mobile',
      },
      {
        title: '邮箱',
        name: 'user_email',
      },
      {
        title: '学校/机构/公司',
        name: 'user_organization',
      },
      {
        title: '擅长领域',
        name: 'user_favourite',
      },
      {
        title: '标注时长',
        name: 'review_span',
        render: (col, record) => {
          const minutes = record.review_span || 0;
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return minutes > 60 ? `${hours}小时${mins}分钟` : `${minutes}分钟`;
        },
      },
      {
        title: '当前身份',
        name: 'user_roles',
        render: (col, record) => {
          let dom = null;
          if (curEditRow === record.user_id) {
            dom = (
              <Select
                multiple
                options={options}
                defaultValue={record.user_roles}
                size="small"
                onChange={this.handleSelect}
                className={styles['select-role']}
              />
            );
          } else {
            dom = (record.user_roles || []).map(role => {
              return <span key={role}>{roleMap[role]}</span>;
            });
          }
          return dom;
        },
      },
      {
        title: '操作',
        name: 'action',
        cls: 'action',
        render: (col, record) => {
          let dom = null;
          if (curEditRow === record.user_id) {
            dom = <span onClick={e => this.saveChange(record)}>保存</span>;
          } else {
            dom = <span onClick={e => this.beginEdit(e, record)}>重新编辑</span>;
          }
          return dom;
        },
      },
    ];
    return (
      <div styleName="container">
        <div styleName="header">
          <h5 styleName="title">人员管理</h5>
          {/* <p styleName="invitation">点击发送邀请链接</p> */}
        </div>
        <div styleName="content">
          <Table columns={columns} dataSource={list} parentStyles={styles} />
        </div>
        <Pagination current={1} totalCount={totalCount} pageSize={this.pageSize} onChange={this.handlePaging} className={styles.buttons} />
      </div>
    );
  }
}
export default Index;
