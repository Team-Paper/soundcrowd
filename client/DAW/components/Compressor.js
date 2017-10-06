import React from 'react';
import { connect } from 'react-redux';
import { Button, Header, Image, Modal, Checkbox, Select } from 'semantic-ui-react';
import { setTrackCompressorThreshold, setTrackCompressorKnee, setTrackCompressorRatio, setTrackCompressorAttack, setTrackCompressorRelease, toggleTrackCompressor } from '../project-store/reducers/tracks';

function CompressorModal({ projectId, track, setTrackCompressorThreshold, setTrackCompressorKnee, setTrackCompressorRatio, setTrackCompressorAttack, setTrackCompressorRelease, toggleTrackCompressor }) {

  return (
    <Modal trigger={<Button>C</Button>}>
    <Modal.Header>Compressor (Track {track.id})</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <div>
          On: <Checkbox toggle checked={track.compressor.on ? true : false } onChange={() => toggleTrackCompressor(projectId, track)} />
        </div>
        <div>
          Threshold: <input type="range" value={track.compressor.threshold} onChange={e => setTrackCompressorThreshold(projectId, track, e.target.value)} max={0} min={-100} step={1} /> {track.compressor.threshold}
        </div>
        <div>
          Knee: <input type="range" value={track.compressor.knee} onChange={e => setTrackCompressorKnee(projectId, track, e.target.value)} max={40} min={0} step={1} /> {track.compressor.knee}
        </div>
        <div>
          Ratio: <input type="range" value={track.compressor.ratio} onChange={e => setTrackCompressorRatio(projectId, track, e.target.value)} max={20} min={1} step={1} /> {track.compressor.ratio}
        </div>
        <div>
          Attack: <input type="range" value={track.compressor.attack} onChange={e => setTrackCompressorAttack(projectId, track, e.target.value)} max={1} min={0.001} step={0.001} /> {track.compressor.attack}
        </div>
        <div>
          Release: <input type="range" value={track.compressor.release} onChange={e => setTrackCompressorRelease(projectId, track, e.target.value)} max={1} min={0.01} step={0.001} /> {track.compressor.release}
        </div>
      </Modal.Description>
    </Modal.Content>
  </Modal>
  );
}

const mapState = (state, ownProps) => ({});

const mapDispatch = dispatch => ({
  setTrackCompressorThreshold: (projectId, track, newThreshold) => dispatch(setTrackCompressorThreshold(projectId, track, newThreshold)),
  setTrackCompressorKnee: (projectId, track, newKnee) => dispatch(setTrackCompressorKnee(projectId, track, newKnee)),
  setTrackCompressorRatio: (projectId, track, newRatio) => dispatch(setTrackCompressorRatio(projectId, track, newRatio)),
  setTrackCompressorAttack: (projectId, track, newAttack) => dispatch(setTrackCompressorAttack(projectId, track, newAttack)),
  setTrackCompressorRelease: (projectId, track, newRelease) => dispatch(setTrackCompressorRelease(projectId, track, newRelease)),
  toggleTrackCompressor: (projectId, track) => dispatch(toggleTrackCompressor(projectId, track)),
});

export default connect(mapState, mapDispatch)(CompressorModal);
