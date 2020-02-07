import request from '../utils/request';
import user from '../utils/localData';
import message from '../components/common/Message';

export const GET_PROFESSION_INFO = 'GET_PROFESSION_INFO';

function tranformData(data) {
  const { nodes, relations, masterField, masterScholar } = data;
  // name
  const scholarItem = nodes.filter(item => item.id === masterScholar).pop();
  const fieldItem = nodes.filter(item => item.id === masterField).pop();
  relations.forEach(element => {
    if (element.start === masterScholar && element.end === masterField) {
      fieldItem.property = element.property;
    }
  });
  // list
  const skills = nodes
    .filter(item => item.type === 'field' && item.id !== masterField)
    .map(item => {
      relations.forEach(element => {
        if (element.end === item.id) {
          item.property = element.property;
        }
      });
      return item;
    });
  const skilledProfessionals = nodes
    .filter(item => item.type === 'scholar' && item.id !== masterScholar)
    .map(item => {
      relations.forEach(element => {
        if (element.start === item.id) {
          item.property = element.property;
        }
      });
      return item;
    });
  return {
    masterField,
    masterScholar,
    scholarItem,
    fieldItem,
    skills,
    skilledProfessionals,
  };
}
// 获取学者信息
export const getProfessionInfo = options => {
  message.loading(true);
  return dispatch => {
    const data = {
      token: user.token(),
      ...(options || {}),
    };
    if (!data.masterScholar) {
      data.masterScholar = '';
    }
    if (!data.masterField) {
      data.masterField = '';
    }
    request('/viewKG/specialView', data, { method: 'GET' })
      .then(res => {
        const { code, data } = res;
        if (code === 0) {
          const Tdata = tranformData(data);

          const { masterField, masterScholar, scholarItem, fieldItem, skills, skilledProfessionals, skillsCount, professionalsCount } = Tdata;
          dispatch({
            type: GET_PROFESSION_INFO,
            payload: {
              masterField,
              masterScholar,
              scholarItem,
              fieldItem,
              skills,
              skilledProfessionals,
              skillsCount,
              professionalsCount,
            },
          });

          message.loading(false);
        }
      })
      .catch(err => {
        console.log(err);
        message.loading(false);
      });
  };
};
