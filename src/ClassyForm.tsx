import React from 'react';

import { Form } from './Form';
import { FormsConsumer, FormsProvider } from './FormsProvider';
import { FormsContextContext, FormsProviderProps } from './interfaces';

export interface ClassyFormProps<P = {}>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>,
    FormsProviderProps {
  children(props: FormsContextContext): React.ReactElement | null;
}

export class ClassyForm extends React.Component<ClassyFormProps> {
  render() {
    const { children, formFieldConfigs, formKey, initFormFields, onSubmit, options, ...passthrough } = this.props;

    return (
      <FormsProvider
        formKey={formKey}
        formFieldConfigs={formFieldConfigs}
        initFormFields={initFormFields}
        options={options}
        onSubmit={onSubmit}
      >
        <Form {...passthrough}>
          <FormsConsumer>{children}</FormsConsumer>
        </Form>
      </FormsProvider>
    );
  }
}
