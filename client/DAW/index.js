import React from 'react';
import { Provider } from 'react-redux';
import { DAW } from './components';
import projectStore from './project-store';
import { connect } from 'react-redux';

// REVIEW: naming convention is the DAW and the main app are inconsistent
const DAWStateWrapper = (props) => (
  <Provider store={projectStore}>
    <DAW {...props} />
  </Provider>
);

const mapState = (state, ownProps) => ({});

export default connect(mapState)(DAWStateWrapper);
