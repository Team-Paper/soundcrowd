import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { addSelectedTrack, removeSelectedTrack } from '../project-store/reducers/timeline/selectedTracks';
import { toggleMuteTrackThunk, setTrackVolume, deleteTrack } from '../project-store/reducers/tracks';

const TrackControls = (props) => {
  const { isSelected, deselectTrack, selectTrack, track, toggleMuteTrackThunk, projectId, setTrackVolume, deleteTrack } = props;
  return (
    <div>
      <Button circular icon onClick={isSelected ? deselectTrack : selectTrack}>
        <Icon color={isSelected ? 'green' : 'red'} name="circle" />
      </Button>
      <Button circular icon onClick={() => toggleMuteTrackThunk(projectId, track)} >
        <Icon color={track.isMuted ? 'red' : 'grey'} name="mute" />
      </Button>
      <Button color='red' onClick={() => deleteTrack(projectId, track.id)}>X</Button>
      <input type="range" value={track.volume} onChange={e => setTrackVolume(projectId, track, e.target.value)} min="0" max="100" step="1" />
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
  setTrackVolume: (projectId, track, newVolume) => dispatch(setTrackVolume(projectId, track, newVolume)),
  deleteTrack: (projectId, track) => dispatch(deleteTrack(projectId, track))
});

export default connect(mapState, mapDispatch)(TrackControls);
