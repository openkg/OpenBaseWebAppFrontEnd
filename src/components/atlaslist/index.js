import React from 'react';
import { connect } from 'react-redux';
import { setChatStatus, CHAT_STATUS, setContentStatus, CONTENT_STATUS, TAP_STATUS, setTapStatus } from '../../actions/chat';
import { getProfessionInfo } from '../../actions/profession';
import CSSModule from 'react-css-modules';
import MapGraph from './MapGraph';
import MapList from './MapList';
import Chat from './chat';
import message from '../common/Message';
import styles from './index.scss';

const getTime = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};
const mapStateToProps = state => {
  const { chatStatus, contentStatus, tapStatus } = state.chat;
  const { masterField, scholarItem, fieldItem, skills, skilledProfessionals, skillsCount, professionalsCount } = state.profession;
  return {
    chatStatus,
    contentStatus,
    tapStatus,
    masterField,
    scholarItem,
    fieldItem,
    skills,
    skilledProfessionals,
    skillsCount,
    professionalsCount,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeChatStatus(status) {
      dispatch(setChatStatus(status));
    },
    getProfessionInfo(id) {
      dispatch(getProfessionInfo(id));
    },
    changeContentStatus(status) {
      dispatch(setContentStatus(status));
    },
    changeTapStatus(status) {
      dispatch(setTapStatus(status));
    },
  };
};
@connect(mapStateToProps, mapDispatchToProps)
@CSSModule(styles, { allowMultiple: true })
class AtlasList extends React.Component {
  componentDidMount() {
    message.loading(true);
    const { getProfessionInfo, changeChatStatus, changeContentStatus, tapStatus, scholarItem } = this.props;
    if (!scholarItem) {
      getProfessionInfo();
    }
    if (tapStatus === 'TAP_STATUS_LIST') {
      changeContentStatus({ payload: CONTENT_STATUS.CONTENT_STATUS_CLOSE });
      changeChatStatus({
        CHAT_STATUS: CHAT_STATUS.CHAT_STATUS_OPEN,
      });
    } else {
      changeContentStatus({ payload: CONTENT_STATUS.CONTENT_STATUS_OPEN });
      changeChatStatus({
        CHAT_STATUS: CHAT_STATUS.CHAT_STATUS_OPEN,
      });
    }
    setTimeout(() => {
      message.loading(false);
    }, 100);
  }

  componentWillUnmount() {
    const { changeContentStatus } = this.props;
    changeContentStatus({ payload: CONTENT_STATUS.CONTENT_STATUS_CLOSE });
  }

  render() {
    const {
      chatStatus,
      changeChatStatus,
      changeTapStatus,
      masterField,
      scholarItem,
      fieldItem,
      skills,
      skilledProfessionals,
      skillsCount,
      professionalsCount,
      changeContentStatus,
      contentStatus,
      tapStatus,
    } = this.props;

    const isReady = [scholarItem, fieldItem, skills, skilledProfessionals].filter(e => !!e).length > 0;

    const isGraph = tapStatus === TAP_STATUS.TAP_STATUS_GRAPH;
    const isShowChat = chatStatus === CHAT_STATUS.CHAT_STATUS_OPEN;
    return (
      <div styleName="map-container">
        <div styleName="map-head">
          <div styleName="tab-pannal">
            <div
              styleName={`panal-item ${isGraph ? 'active' : ''}`}
              onClick={() => {
                changeTapStatus({ payload: TAP_STATUS.TAP_STATUS_GRAPH });
                changeContentStatus({
                  payload: CONTENT_STATUS.CONTENT_STATUS_OPEN,
                });
                changeChatStatus({
                  CHAT_STATUS: CHAT_STATUS.CHAT_STATUS_OPEN,
                });
              }}
            >
              图谱展示
            </div>
            {/* <div
              styleName={`panal-item ${isGraph ? '' : 'active'}`}
              onClick={() => {
                changeTapStatus({ payload: TAP_STATUS.TAP_STATUS_LIST })
                changeContentStatus({
                  payload: CONTENT_STATUS.CONTENT_STATUS_CLOSE,
                })
                changeChatStatus({
                  CHAT_STATUS: CHAT_STATUS.CHAT_STATUS_OPEN,
                })
              }}
            >
              列表展示
            </div> */}
          </div>
        </div>
        <div styleName="map-body">
          {isGraph ? (
            <div styleName="map-graph">
              <div styleName="graph-box">
                <div styleName={`graph-wrap ${isShowChat ? '' : 'full-width'}`} className="mg-border">
                  <h3>全球人工智能学术知识图谱（KG 4 AI）</h3>
                  {isReady && (
                    <MapGraph
                      masterField={masterField}
                      scholarItem={scholarItem}
                      fieldItem={fieldItem}
                      skills={skills}
                      skilledProfessionals={skilledProfessionals}
                      chatStatus={chatStatus}
                      contentStatus={contentStatus}
                    />
                  )}
                </div>
                {chatStatus === CHAT_STATUS.CHAT_STATUS_OPEN ? (
                  <div styleName="chat-wrap">
                    <Chat />
                  </div>
                ) : (
                  <div
                    styleName="switch-box"
                    onClick={() => {
                      changeChatStatus({
                        CHAT_STATUS: CHAT_STATUS.CHAT_STATUS_OPEN,
                      });
                      changeContentStatus({
                        payload: CONTENT_STATUS.CONTENT_STATUS_OPEN,
                      });
                    }}
                  >
                    <span styleName="text">展开</span>
                    <span styleName="icon-switch" />
                  </div>
                )}
              </div>
              <p styleName="graph-info">
                {getTime()} 通过审核机制更新了 {skillsCount || 77}个实体和{professionalsCount || 77}个关系
              </p>
            </div>
          ) : (
            <div styleName="map-list">
              <MapList />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AtlasList;
