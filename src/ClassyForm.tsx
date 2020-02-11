import React from 'react';

import { Form } from './Form';
import { FormsConsumer, FormsProvider } from './FormsProvider';
import { FormsContextContext, FormsProviderProps } from './interfaces';

export interface ClassyFormProps<P = {}> extends React.FormHTMLAttributes<HTMLFormElement>, FormsProviderProps {
  children(props: FormsContextContext): React.ReactElement | null;
}

export class ClassyForm extends React.Component<ClassyFormProps> {
  render() {
    const { children, formFieldConfigs, initFormFields, onSubmit, ...passthrough } = this.props;

    return (
      <FormsProvider formFieldConfigs={formFieldConfigs} initFormFields={initFormFields} onSubmit={onSubmit}>
        <Form {...passthrough}>
          <FormsConsumer>{children}</FormsConsumer>
        </Form>
      </FormsProvider>
    );
  }
}
