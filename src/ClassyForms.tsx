import React from 'react';

import { FormsConsumer, FormsProvider } from './FormsProvider';
import { FormsContextContext, FormsProviderProps } from './interfaces';

export interface ClassyFormsProps<P = {}> extends FormsProviderProps {
  children(props: FormsContextContext): React.ReactElement | null;
}

export class ClassyForms extends React.Component<ClassyFormsProps> {
  render() {
    const { children, ...passthrough } = this.props;

    return (
      <FormsProvider {...passthrough}>
        <FormsConsumer>{children}</FormsConsumer>
      </FormsProvider>
    );
  }
}
