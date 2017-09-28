import React from 'react';
import { Provider } from 'react-redux';
import { DAW } from './components';
import projectStore from './project-store';

const DAWStateWrapper = () => (
  <Provider store={projectStore}>
    <DAW />
  </Provider>
);

export default DAWStateWrapper;
