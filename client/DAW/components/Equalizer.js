import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Checkbox } from 'semantic-ui-react';
import { setTrackEQBandGain, toggleTrackEQ } from '../project-store/reducers/tracks';

function EqualizerModal({ projectId, track, setTrackEQBandGain, toggleTrackEQ }) {
  const styles = {
    gain: { height: 20, width: 150, margin: 0, transformOrigin: '75px 75px', transform: 'rotate(-90deg)' },
    gainWrapper: { display: 'inline-block', width: 20, height: 150, padding: 0 },
    bandWrapper: { display: 'inline-block', width: 50 },
  };

  return (
    <Modal trigger={<Button color={track.eq.on ? 'grey' : ''} size="mini">EQ</Button>}>
      <Modal.Header>12-Band Equalizer (Track {track.id})</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div>
            On:
            <Checkbox
              toggle
              checked={!!track.eq.on}
              onChange={() => toggleTrackEQ(projectId, track)}
            />
          </div>
          {
            Object.keys(track.eq.bands).map(key =>
              (<div style={styles.bandWrapper} key={`band-${key}`}>
                <div style={styles.gainWrapper}>
                  <input
                    type="range"
                    value={track.eq.bands[key].gain}
                    onChange={e => setTrackEQBandGain(projectId, track, key, e.target.value)}
                    style={styles.gain}
                    max={20}
                    min={-60}
                    step={0.5}
                  />
                </div>
                <div>{track.eq.bands[key].f}</div>
              </div>),
            )
          }
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

const mapState = () => ({});

const mapDispatch = dispatch => ({
  setTrackEQBandGain: (projectId, track, band, newGain) =>
    dispatch(setTrackEQBandGain(projectId, track, band, newGain)),
  toggleTrackEQ: (projectId, track) => dispatch(toggleTrackEQ(projectId, track)),
});

export default connect(mapState, mapDispatch)(EqualizerModal);
