import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './Pagination.scss';
import Button from './Button';

@CSSModule(styles, { allowMultiple: true })
class Pagination extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: props.current || 1,
      onChange: props.onChange || (() => {}),
    };
  }
  get maxIndex() {
    const { pageSize, totalCount } = this.props;
    const maxIndex = Math.ceil(totalCount / pageSize);

    return maxIndex;
  }
  changePageIndex(index) {
    const { onChange } = this.state;
    const { maxIndex } = this;

    if (index >= this.maxIndex) {
      index = this.maxIndex;
    } else if (index <= 1) {
      index = 1;
    }

    this.setState({
      currentPageIndex: index,
    });

    onChange({ pageIndex: index, maxIndex });
  }
  submit = () => {
    const { onSubmit } = this.props;
    if (typeof onSubmit === 'function') {
      onSubmit();
    }
  };
  render() {
    const { currentPageIndex } = this.state;
    return (
      <div styleName="buttons">
        <Button
          styleClass="border"
          className={`${currentPageIndex <= 1 ? styles['not-allowed'] : ''}`}
          onClick={() => {
            this.changePageIndex(currentPageIndex - 1);
          }}
        >
          上一页
        </Button>
        <Button
          className={`next-btn ${currentPageIndex >= this.maxIndex ? styles['not-allowed'] : ''}`}
          onClick={() => {
            this.changePageIndex(currentPageIndex + 1);
          }}
        >
          {' '}
          下一页
        </Button>
        {this.props.showSubmit && (
          <Button onClick={this.submit} className={`${currentPageIndex !== this.maxIndex ? styles['not-allowed'] : ''}`}>
            提交
          </Button>
        )}
      </div>
    );
  }
}
export default Pagination;
