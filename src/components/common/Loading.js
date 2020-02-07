import React from 'react';
import styles from './Loading.scss';

const Loading = props => {
  const { loading } = props;

  return loading ? (
    <React.Fragment>
      <span className={`${styles['loading-wrap']} mg-center1`}>
        <i /> <i /> <i /> <i />
      </span>
      <div className={styles.mask} />
    </React.Fragment>
  ) : null;
};
export default Loading;
