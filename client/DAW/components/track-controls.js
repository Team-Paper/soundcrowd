import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { addSelectedTrack, removeSelectedTrack } from '../project-store/reducers/timeline/selectedTracks';

const TrackControls = (props) => {
  const { isSelected, deselectTrack, selectTrack } = props;
  return (
    <Button circular icon onClick={isSelected ? deselectTrack : selectTrack}>
      <Icon color={isSelected ? 'green' : 'red'} name="circle" />
    </Button>
  );
};

const mapState = (state, ownProps) => ({
  isSelected: state.timeline.selectedTracks.indexOf(ownProps.track.id) !== -1,
});

const mapDispatch = (dispatch, ownProps) => ({
  deselectTrack: () => dispatch(removeSelectedTrack(ownProps.track.id)),
  selectTrack: () => dispatch(addSelectedTrack(ownProps.track.id)),
});

export default connect(mapState, mapDispatch)(TrackControls);
