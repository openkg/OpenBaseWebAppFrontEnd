import React from 'react';
import styles from './Input.scss';
import { InputGroup } from 'react-html5-form';

const onInput = (e, inputGroup, form) => {
  // Update state only of input group in focus
  inputGroup.checkValidityAndUpdate();
  // Update "valid" property of the form
  form && form.checkValidityAndUpdate() // eslint-disable-line
};
class StrictInput extends React.PureComponent {
  render() {
    const {
      label,
      name,
      type = 'text',
      position = 'bottom',
      valueMissing,
      typeMismatch,
      patternMismatch,
      tooShort,
      className,
      placeholder,
      form,
      inputIcon,
      wrapCls,

      ...rest
    } = this.props;

    const renderError = error => (
      <p className={styles['invalid-wrap']}>
        <i className={styles['icon-error']} />
        <span className={styles.invalid}>{error}</span>
      </p>
    );
    return (
      <InputGroup
        tag="div"
        validate={[name]}
        className={`${wrapCls} ${styles['input-container']}`}
        translate={{
          [name]: {
            valueMissing,
            typeMismatch,
            patternMismatch,
            tooShort,
          },
        }}
      >
        {({ error, inputGroup }) => (
          <React.Fragment>
            {label && <label>{label}</label>}
            {error && position === 'top' && renderError(error)}
            <div className={`${styles['input-wrap']} ${inputIcon || ''}`}>
              <input
                type={type}
                required
                autoComplete="off"
                name={name}
                className={className}
                placeholder={placeholder}
                onInput={e => onInput(e, inputGroup, form)}
                {...rest}
              />
              {this.props.child}
              {error && position === 'text-bottom' && renderError(error)}
            </div>
            {error && position === 'bottom' && renderError(error)}
          </React.Fragment>
        )}
      </InputGroup>
    );
  }
}
export default StrictInput;
