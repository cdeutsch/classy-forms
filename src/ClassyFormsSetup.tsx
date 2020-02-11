import React from 'react';

import { FormsConsumer, FormsProvider } from './FormsProvider';
import { FormsContextContext, FormsProviderProps } from './interfaces';

export interface ClassyFormsSetupProps<P = {}> extends FormsProviderProps {
  children(props: FormsContextContext): React.ReactElement | null;
}

export class ClassyFormsSetup extends React.Component<ClassyFormsSetupProps> {
  render() {
    const { children, ...passthrough } = this.props;

    return (
      <FormsProvider {...passthrough}>
        <FormsConsumer>{children}</FormsConsumer>
      </FormsProvider>
    );
  }
}
