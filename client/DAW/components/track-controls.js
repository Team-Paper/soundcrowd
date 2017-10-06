import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Icon, Input } from 'semantic-ui-react';
import { addSelectedTrack, removeSelectedTrack } from '../project-store/reducers/timeline/selectedTracks';
import { toggleMuteTrackThunk, setTrackVolume, deleteTrack, setName } from '../project-store/reducers/tracks';
import ReverbModal from './Reverb';
import EqualizerModal from './Equalizer';

const styles = {
  trackControls: {
    width: '180px',
    height: '154px',
    margin: '0',
    borderRadius: '0',
  },
};

class TrackControls extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      dirty : false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(projectId, track, newName){
    this.setState({dirty: true})
    this.props.setName(projectId, track, newName)
  }

  render() {
  const {
    isSelected,
    deselectTrack,
    selectTrack,
    track,
    toggleMuteTrackThunk,
    projectId,
    setTrackVolume,
    deleteTrack,
  } = this.props;

  return (
    <Card style={styles.trackControls}>
      <Card.Content>
        <Card.Header>
          <Input type="text" transparent value={track.name || this.state.dirty ? track.name : `Track #${track.id}`} onChange={e => this.handleChange(projectId, track, e.target.value)} />
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
        </Card.Description>
      </Card.Content>
    </Card>
  );
  }
  }


const mapState = (state, ownProps) => ({
  isSelected: state.timeline.selectedTracks.indexOf(ownProps.track.id) !== -1,
});

const mapDispatch = (dispatch, ownProps) => ({
  deselectTrack: () => dispatch(removeSelectedTrack(ownProps.track.id)),
  selectTrack: () => dispatch(addSelectedTrack(ownProps.track.id)),
  toggleMuteTrackThunk: (projectId, track) => dispatch(toggleMuteTrackThunk(projectId, track)),
  setTrackVolume: (projectId, track, newVolume) =>
    dispatch(setTrackVolume(projectId, track, newVolume)),
  setName: (projectId, track, newName) => dispatch(setName(projectId, track, newName)),
  deleteTrack: (projectId, track) => dispatch(deleteTrack(projectId, track)),
});

export default connect(mapState, mapDispatch)(TrackControls);
