import React from 'react';

import { Form } from './Form';
import { FormsConsumer, FormsProvider } from './FormsProvider';
import { FormObject, FormsContextContext, FormsProviderProps } from './interfaces';

export interface ClassyFormProps<T = FormObject>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>,
    FormsProviderProps<T> {
  children(props: FormsContextContext): React.ReactElement | null;
}

export class ClassyForm<T = FormObject> extends React.Component<ClassyFormProps<T>> {
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
