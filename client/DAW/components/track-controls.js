import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Icon } from 'semantic-ui-react';
import { addSelectedTrack, removeSelectedTrack } from '../project-store/reducers/timeline/selectedTracks';
import { toggleMuteTrackThunk, setTrackVolume, deleteTrack } from '../project-store/reducers/tracks';
import ReverbModal from './Reverb';
import EqualizerModal from './Equalizer';
import CompressorModal from './Compressor';

const styles = {
  trackControls: {
    width: '180px',
    height: '154px',
    margin: '0',
    borderRadius: '0',
  },
};

const TrackControls = (props) => {
  const {
    isSelected,
    deselectTrack,
    selectTrack,
    track,
    toggleMuteTrackThunk,
    projectId,
    setTrackVolume,
    deleteTrack,
  } = props;
  return (
    <Card style={styles.trackControls}>
      <Card.Content>
        <Card.Header>
          Track #{track.id}
        </Card.Header>
        <Card.Description>
          <Button circular icon onClick={isSelected ? deselectTrack : selectTrack}>
            <Icon color={isSelected ? 'green' : 'red'} name="circle" />
          </Button>
          <Button circular icon onClick={() => toggleMuteTrackThunk(projectId, track)} >
            <Icon color={track.isMuted ? 'red' : 'grey'} name="mute" />
          </Button>
          <Button color="red" icon="remove" onClick={() => deleteTrack(projectId, track.id)} />
          <input
            type="range"
            value={track.volume}
            onChange={e => setTrackVolume(projectId, track, e.target.value)}
            min="0"
            max="100"
            step="1"
          />
          <ReverbModal track={track} projectId={projectId} />
          <EqualizerModal track={track} projectId={projectId} />
          <CompressorModal track={track} projectId={projectId} />
        </Card.Description>
      </Card.Content>
    </Card>
  );
};
const mapState = (state, ownProps) => ({
  isSelected: state.timeline.selectedTracks.indexOf(ownProps.track.id) !== -1,
});

const mapDispatch = (dispatch, ownProps) => ({
  deselectTrack: () => dispatch(removeSelectedTrack(ownProps.track.id)),
  selectTrack: () => dispatch(addSelectedTrack(ownProps.track.id)),
  toggleMuteTrackThunk: (projectId, track) => dispatch(toggleMuteTrackThunk(projectId, track)),
  setTrackVolume: (projectId, track, newVolume) =>
    dispatch(setTrackVolume(projectId, track, newVolume)),
  deleteTrack: (projectId, track) => dispatch(deleteTrack(projectId, track)),
});

export default connect(mapState, mapDispatch)(TrackControls);
