import React from 'react';

export interface HelloProps {
  text: string;
}

// tslint:disable-next-line: no-default-export
export default class Hello extends React.Component<HelloProps> {
  public render() {
    const { text } = this.props;

    return <h1 style={{ color: 'red' }}>Hello {text}</h1>;
  }
}
