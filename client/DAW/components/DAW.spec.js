import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { UserHome } from './user-home';

describe('DAW', () => {
  let daw;

  beforeEach(() => {
    daw = shallow(<DAW email={'cody@email.com'} />);
  });

  it('renders the timeline component', () => {
    expect(daw.find(Timeline)).to.have.length(1);
    // expect(userHome.find('h3').text()).to.be.equal('Welcome, cody@email.com')
  });
});
