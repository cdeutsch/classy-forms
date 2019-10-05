import { shallow } from 'enzyme';
import React from 'react';

import Hello from '../index';

describe('Hello, Enzyme!', () => {
  it('renders', () => {
    const wrapper = shallow(<Hello text="World" />);
    expect(wrapper.find('h1').html()).toMatch(/Hello World/);
  });

  it('renders snapshots, too', () => {
    const wrapper = shallow(<Hello text="World" />);
    expect(wrapper).toMatchSnapshot();
  });
});
