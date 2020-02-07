import React from 'react';
import CSSmodule from 'react-css-modules';
import styles from './Select.scss';

@CSSmodule(styles, { allowMultiple: true })
class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedItems: this.getDefaultItems(props.defaultValue),
    };
  }
  componentDidMount() {
    document.addEventListener(
      'click',
      () => {
      this.state.open && this.setState({ open: false }) // eslint-disable-line
      },
      false
    );
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      const items = this.getDefaultItems(nextProps.defaultValue);
      this.setState({ selectedItems: items });
    }
  }
  get multiple() {
    return !!this.props.multiple;
  }
  getDefaultItems = (defaultValue = this.props.defaultValue) => {
    const { options } = this.props;
    const option = this.formatOptions(options);
    const values = this.formatToArray(defaultValue);

    const items = values.map(value => {
      return option[value] && { value, text: option[value] };
    });
    return items;
  };
  setValue = value => {
    const items = this.getDefaultItems(value);
    this.setState({ selectedItems: items });
  };
  getSelectedValues = selectedItems => {
    selectedItems = selectedItems || this.state.selectedItems;
    const value = selectedItems.map(item => item.value);

    return value;
  };
  formatOptions = options => {
    const option = {};
    options.forEach(item => {
      option[item.value] = item.text;
    });
    return option;
  };
  formatToArray = item => {
    if (!item) {
      return [];
    }
    if (Array.isArray(item)) {
      return item;
    }
    if (typeof item === 'string') {
      return item.split(',');
    }
    const items = this.multiple ? item : [item];
    return items;
  };
  toggleSelect = e => {
    this.setState({ open: !this.state.open });
    // 原生事件阻止冒泡
    e.nativeEvent.stopImmediatePropagation();
  };
  handleSelected = (option, e) => {
    // 阻止react事件冒泡
    e.stopPropagation();
    // 阻止原生事件冒泡
    e.nativeEvent.stopImmediatePropagation();
    const { onChange } = this.props;
    let selectedItems = this.state.selectedItems.slice();

    let open = !this.state.open;
    const index = selectedItems.findIndex(item => item.value == option.value) // eslint-disable-line

    if (this.multiple) {
      if (index === -1) {
        selectedItems.push(option);
      } else {
        selectedItems.splice(index, 1);
      }
      open = true;
    } else {
      selectedItems = [option];
    }
    const value = this.getSelectedValues(selectedItems).join(',');
    typeof onChange === 'function' && onChange(value, selectedItems) // eslint-disable-line
    this.setState({ selectedItems, open });
  };
  renderSelected = () => {
    const { selectedItems } = this.state;
    const cls = 'selected-option';
    let children = null;
    if (!this.multiple && selectedItems.length > 0) {
      children = <span className={cls}>{selectedItems[0].text}</span>;
    } else {
      const options = selectedItems.map(item => {
        return <li key={Math.random()}>{item.text}</li>;
      });
      children = <ul>{options}</ul>;
    }
    return <div styleName="selected-wrap">{children}</div>;
  };
  render() {
    const { open } = this.state;
    const { options, className, size = '' } = this.props;
    const selectedValues = this.getSelectedValues();
    const arrowCls = `select-arrow ${open ? 'active' : ''}`;
    return (
      <div styleName={`rc-select ${size}`} className={className} onClick={this.toggleSelect}>
        <span styleName={arrowCls} />
        {this.renderSelected()}
        {this.state.open && (
          <ul styleName="options">
            {options.map(item => {
              const selected = selectedValues.indexOf(item.value) > -1;
              return (
                <li key={Math.random()} styleName={selected ? 'selected' : ''} onClick={e => this.handleSelected(item, e)}>
                  {item.text}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}
export default Select;
