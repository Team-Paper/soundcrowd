/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { UserHome } from './user-home';

describe('UserHome', () => {
  const user = {
    id: '1',
    username: 'Test User',
    userImage: './test.jpg',
    userBio: 'This is a test bio',
  };
  const songs = [{
    artist: [user],
    title: 'Test Song',
  }];
  const projects = [{
    title: 'Test Project',
    user: [user],
  }];

  let userHome;

  beforeEach(() => {
    userHome = shallow(<UserHome user={user} songs={songs} projects={projects} />);
  });

  it('renders the email in an h3', () => {
    expect(userHome.find('h3').text()).to.be.equal('Welcome, cody@email.com');
  });
});
