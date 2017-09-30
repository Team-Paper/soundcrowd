import React from 'react';
import DAW from '../DAW';

/**
 * COMPONENT
 */
export const Project = (props) => {
  console.log('Project props are', props)
  return (<DAW {...props} />)};

export default Project;
