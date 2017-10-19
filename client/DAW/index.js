import React from 'react';
import { Provider } from 'react-redux';
import { DAW } from './components';
import projectStore from './project-store';

const DAWStateWrapper = props => (
  <Provider store={projectStore}>
    <DAW {...props} />
  </Provider>
);

export default DAWStateWrapper;
