import React from 'react';
import { connect } from 'react-redux';
import { Button, Header, Image, Modal, Checkbox, Select } from 'semantic-ui-react';
import { setTrackReverbGain, toggleTrackReverb } from '../project-store/reducers/tracks';

const ReverbModal = function({ projectId, track, setTrackReverbGain, toggleTrackReverb, reverbs }) {
  const reverbOptions = Object.entries(reverbs).map(([key, reverb]) => ({ key: key, value: key, text: reverb.title }))

  return (
    <Modal trigger={<Button color={track.reverb.on ? 'grey' : '' } size='mini'>R</Button>}>
    <Modal.Header>Convolution Reverb (Track {track.id})</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        On: <Checkbox toggle checked={track.reverb.on ? true : false } onChange={() => toggleTrackReverb(projectId, track)} />
        <label>Gain: </label><input type="range" value={track.reverb.gain} onChange={e => setTrackReverbGain(projectId, track, e.target.value)} max={1} min={0} step={.01} />
        <Select placeholder="select reverb" options={reverbOptions} value={`${track.reverb.id}`} />
      </Modal.Description>
    </Modal.Content>
  </Modal>
  );
}

const mapState = (state, ownProps) => ({
  reverbs: state.reverbs,
});

const mapDispatch = dispatch => ({
  setTrackReverbGain: (projectId, track, newGain) => dispatch(setTrackReverbGain(projectId, track, newGain)),
  toggleTrackReverb: (projectId, track) => dispatch(toggleTrackReverb(projectId, track)),
});

export default connect(mapState, mapDispatch)(ReverbModal);
