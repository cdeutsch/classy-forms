import React from 'react';

import { Form } from './Form';
import { FormsConsumer, FormsProvider } from './FormsProvider';
import { FormsContextContext, FormsProviderProps } from './interfaces';

export interface ClassyFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>,
    FormsProviderProps {
  children(props: FormsContextContext): React.ReactElement | null;
}

export class ClassyForm extends React.Component<ClassyFormProps> {
  render() {
    const { children, formFieldConfigs, formKey, onSubmit, options, ...passthrough } = this.props;

    return (
      <FormsProvider formKey={formKey} formFieldConfigs={formFieldConfigs} options={options} onSubmit={onSubmit}>
        <Form {...passthrough}>
          <FormsConsumer>{children}</FormsConsumer>
        </Form>
      </FormsProvider>
    );
  }
}
