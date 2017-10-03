import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { addSelectedTrack } from '../project-store/reducers/timeline/selectedTracks';

const TrackControls = (props) => {
  const { selectTrack } = props;
  return (
    <Button circular icon onClick={() => selectTrack()}>
      <Icon color="red" name="circle" />
    </Button>
  );
};

const mapState = () => ({});

const mapDispatch = (dispatch, ownProps) => ({
  selectTrack: () => dispatch(addSelectedTrack(ownProps.track.id)),
});

export default connect(mapState, mapDispatch)(TrackControls);
