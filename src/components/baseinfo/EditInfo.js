import React from 'react';
import CSSModule from 'react-css-modules';
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';
import styles from './index.scss';
import { mapDatatoProps } from '../../actions/user';
import { redirect } from '../../utils/history';
import { Form } from '../common/form/Form';
import Input from '../../components/common/form/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import defaultImage from '../../assets/images/default-headpic.png';

@CSSModule(styles, { allowMultiple: true })
class EditInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.props.userinfo || {}, {
      showCrop: false,
      cropImageUrl: defaultImage,
    });
  }
  componentDidMount() {
    const { getUserInfo } = this.props;
    const token = sessionStorage.getItem('token');
    if (!token || token === '') {
      redirect('/');
      return;
    }
    getUserInfo(token).then(data => {
      if (!data || data.code !== 0) {
        redirect('/');
      }
      const userinfo = mapDatatoProps(data.data);
      this.setState(userinfo);
    });
  }
  onSelectFile = e => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.readAsDataURL(file);
    reader.onload = () => {
      const array = file.name.split('.');
      this.filetype = array[array.length - 1];
      this.setState({ cropImageUrl: reader.result });
    };
  };
  cropImage = () => {
    const result = this.cropper.getCroppedCanvas();
    if (typeof result === 'undefined') {
      return false;
    }

    const { uploadPicture } = this.props;
    const token = sessionStorage.getItem('token');
    const content = result.toDataURL();
    return uploadPicture({ filetype: this.filetype || 'jpg', filecontent: content.slice('data:image/png;base64,'.length), token }).then(data => {
      if (data.code === 0) {
        this.setState({ headPortrait: data.data.uri, showCrop: false });
      }
    });
  };
  showCropModal = () => {
    this.setState({ showCrop: true });
  };
  closeCropModal = () => {
    this.setState({ showCrop: false });
  };
  submit = () => {
    const { setUserInfo } = this.props;
    const token = sessionStorage.getItem('token');
    const userinfo = Object.assign({}, this.state, { token });
    setUserInfo(userinfo);
  };
  cancel = () => {
    redirect('/index');
  };
  render() {
    const { fullname, mobile, email, organization, skilled, headPortrait, cropImageUrl } = this.state;

    const options = [
      { text: '金融', value: '金融' },
      { text: '人工智能', value: '人工智能' },
      { text: '计算机', value: '计算机' },
      { text: '医疗', value: '医疗' },
      { text: '农业', value: '农业' },
    ];
    return (
      <div styleName="baseinfo edit">
        <Form onSubmit={this.submit}>
          <h5 styleName="title">个人信息</h5>
          <div styleName="content">
            <div styleName="left-panel">
              <Input
                label="姓名："
                name="fullname"
                maxLength="4"
                position="text-bottom"
                valueMissing="请输入您的真实姓名"
                wrapCls={styles.item}
                defaultValue={fullname}
                onChange={e => this.setState({ fullname: e.target.value })}
              />
              <Input
                label="手机号："
                disabled
                name="mobile"
                pattern="^1\d{10}$"
                wrapCls={styles.item}
                position="text-bottom"
                placeholder="请输入手机号"
                valueMissing="请输入手机号"
                patternMismatch="输入不正确，请重新输入"
                maxLength="11"
                defaultValue={mobile}
                onChange={e => this.setState({ mobile: e.target.value })}
              />
              <Input
                label="邮箱："
                name="email"
                type="email"
                wrapCls={styles.item}
                position="text-bottom"
                placeholder="请输入邮箱"
                valueMissing="请输入邮箱"
                typeMismatch="输入不正确，请重新输入"
                defaultValue={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
              <Input
                label="学校／机构／公司："
                name="organization"
                wrapCls={styles.item}
                position="text-bottom"
                placeholder="请输入学校/机构/公司"
                valueMissing="请输入学校/机构/公司"
                defaultValue={organization}
                onChange={e => this.setState({ organization: e.target.value })}
              />
              <div styleName="item">
                <label>擅长领域：</label>
                <Select
                  multiple
                  className={styles.skills}
                  options={options}
                  defaultValue={skilled}
                  onChange={value => {
                    this.setState({ skilled: value ? value.split(',') : [] });
                  }}
                />
              </div>
            </div>
            <div styleName="right-panel">
              <img src={headPortrait} styleName="user-portrait" onClick={this.showCropModal} />
              <span>编辑头像</span>
            </div>
          </div>
          <div styleName="footer">
            <Button onClick={this.cancel} styleClass="border">
              取消
            </Button>
            <Button>保存</Button>
          </div>
        </Form>
        {this.state.showCrop && (
          <React.Fragment>
            <div styleName="cropbox" className="mg-center">
              <div styleName="upload-wrap">
                <span>选择图片</span>
                <input type="file" accept="image/*" styleName="fileupload" onChange={this.onSelectFile} />
              </div>
              <Cropper
                styleName="crop-wrap"
                aspectRatio={1}
                preview="#img-preview"
                guides={false}
                src={cropImageUrl}
                ref={cropper => {
                  this.cropper = cropper;
                }}
              />
              <div styleName="preview-wrap">
                <h5>头像预览</h5>
                <div id="img-preview" styleName="img-preview" />
              </div>
              <div styleName="buttons">
                <Button onClick={this.cropImage}>确定</Button>
                <Button onClick={this.closeCropModal} styleClass="border">
                  取消
                </Button>
              </div>
            </div>
            <div styleName="pop-mask" />
          </React.Fragment>
        )}
      </div>
    );
  }
}
export default EditInfo;
