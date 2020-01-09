import React from 'react';

import { FormsContext } from './FormsProvider';

export class Form extends React.Component<React.FormHTMLAttributes<HTMLFormElement>> {
  static contextType = FormsContext;
  context!: React.ContextType<typeof FormsContext>;

  render() {
    const { onSubmit, ...passthrough } = this.props;

    return <form onSubmit={this.onSubmit} {...passthrough} />;
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    this.context.onSubmit(event);
    if (this.props.onSubmit) {
      this.props.onSubmit(event);
    }
  };
}
