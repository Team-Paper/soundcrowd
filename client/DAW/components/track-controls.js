import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

const TrackControls = (props) => {
  const { selectTrack } = props;
  return (
    <Button circular icon onClick={() => selectTrack(track)}>
      <Icon color="red" name="circle" />
    </Button>
  );
};

const mapState = state => ({});

const mapDispatch = dispatch => ({
  selectTrack: track => null,
});

export default connect(mapState, mapDispatch)(TrackControls);
