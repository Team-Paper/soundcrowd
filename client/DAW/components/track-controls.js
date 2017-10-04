import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { addSelectedTrack, removeSelectedTrack } from '../project-store/reducers/timeline/selectedTracks';
import { toggleMuteTrackThunk } from '../project-store/reducers/tracks';

const TrackControls = (props) => {
  const { isSelected, deselectTrack, selectTrack, track, toggleMuteTrackThunk, projectId } = props;
  return (
    <div>
      <Button circular icon onClick={isSelected ? deselectTrack : selectTrack}>
        <Icon color={isSelected ? 'green' : 'red'} name="circle" />
      </Button>
      <Button circular icon onClick={() => toggleMuteTrackThunk(projectId, track)} >
        <Icon color={track.isMuted ? 'red' : 'grey'} name="mute" />
      </Button>
    </div>
  );
};

const mapState = (state, ownProps) => ({
  isSelected: state.timeline.selectedTracks.indexOf(ownProps.track.id) !== -1,
  ownProps: ownProps,
});

const mapDispatch = (dispatch, ownProps) => ({
  deselectTrack: () => dispatch(removeSelectedTrack(ownProps.track.id)),
  selectTrack: () => dispatch(addSelectedTrack(ownProps.track.id)),
  toggleMuteTrackThunk: (projectId, track) => dispatch(toggleMuteTrackThunk(projectId, track)),
});

export default connect(mapState, mapDispatch)(TrackControls);
