/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Form } from 'classy-forms';
import React from 'react';

import { Page } from '../components/Page';

export class Home extends React.Component {
  render() {
    return (
      <Page>
        <Form>Hello</Form>
      </Page>
    );
  }
}

// tslint:disable-next-line: export-name no-default-export
export default Home;
