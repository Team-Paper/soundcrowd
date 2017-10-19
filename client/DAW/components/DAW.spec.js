/* global xdescribe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { DAW, Timeline } from '../components';

xdescribe('DAW', () => {
  let daw;

  beforeEach(() => {
    daw = shallow(<DAW />);
  });

  it('renders the timeline component', () => {
    expect(daw.find(Timeline)).to.have.length(1);
  });
});
