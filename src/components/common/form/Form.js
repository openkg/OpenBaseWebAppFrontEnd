import React from 'react';
import { Form } from 'react-html5-form';

class Html5Form extends React.PureComponent {
  render() {
    const { onSubmit, children, className } = this.props;
    return (
      <Form onSubmit={onSubmit} className={className}>
        {({ error }) => (
          <React.Fragment>
            {children}
            {error && <p>{error}</p>}
          </React.Fragment>
        )}
      </Form>
    );
  }
}
export default Html5Form;
export { Html5Form as Form };
export { default as Input } from './Input';
