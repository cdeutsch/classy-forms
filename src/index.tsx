import * as React from 'react';

export interface HelloProps {
  text: string;
}

// tslint:disable-next-line: no-default-export
export default class Hello extends React.Component<HelloProps> {
  public render() {
    const { text } = this.props;

    return <div style={{ color: 'red' }}>Hello {text}</div>;
  }
}
