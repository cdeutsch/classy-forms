import React from 'react';

import { FormsConsumer, FormsProvider } from './FormsProvider';
import { FormObject, FormsContextContext, FormsProviderProps } from './interfaces';

export interface ClassyFormsSetupProps<T = FormObject> extends FormsProviderProps<T> {
  children(props: FormsContextContext): React.ReactElement | null;
}

export class ClassyFormsSetup<T = FormObject> extends React.Component<ClassyFormsSetupProps<T>> {
  render() {
    const { children, ...passthrough } = this.props;

    return (
      <FormsProvider {...passthrough}>
        <FormsConsumer>{children}</FormsConsumer>
      </FormsProvider>
    );
  }
}
