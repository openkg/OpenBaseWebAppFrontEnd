import { history } from '../Store';

export default history;

export const redirect = path => {
  history.push(path);
};
