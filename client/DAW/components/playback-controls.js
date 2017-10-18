import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, Input } from 'semantic-ui-react';
import { setTime } from '../project-store/reducers/timeline/time';
import { MixdownModal } from '../components';
import { setLengthThunk } from '../project-store/reducers/settings/length';

const PlaybackControls = (props) => {
  const { mixdown, isPlaying, isReady, resetTime, togglePlay, startRecord, stopRecord, isRecording, time, addTrack, setLengthThunk, length, projectId } = props;
  return (
    <Menu >
      <Menu.Item
        name="reset"
        onClick={() => {
          if (isPlaying) togglePlay();
          setTimeout(resetTime, 10);
        }}
      >
        <Icon name="step backward" />
      </Menu.Item>
      {
        isPlaying ?
          <Menu.Item name="pause" onClick={() => togglePlay()}>
            <Icon name="pause" />
          </Menu.Item> :
          <Menu.Item name="play" onClick={() => togglePlay()}>
            <Icon name="play" />
          </Menu.Item>
      }
      {
        isRecording ?
          <Menu.Item name="stop-record" onClick={() => stopRecord()}>
            <Icon color="red" name="stop circle outline" />
          </Menu.Item> :
          <Menu.Item name="record" onClick={() => (isReady ? startRecord() : alert('Select tracks below to start recording'))}>
            <Icon name="circle" color={isReady ? 'black' : 'grey'} />
          </Menu.Item>
      }
      <Menu.Item>
        Time: &nbsp;&nbsp;&nbsp;{time.toFixed(2)}
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item>
          Length (s):
        </Menu.Item>
        <Menu.Item>
          <Input value={length} onChange={e => setLengthThunk(projectId, e.target.value)} />
        </Menu.Item>
        <Menu.Item onClick={() => addTrack()}>
          Add Track
        </Menu.Item>
        <Menu.Item as={MixdownModal} mixdown={mixdown} >
          Mixdown
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

const mapState = state => ({
  isPlaying: state.timeline.isPlaying,
  isRecording: state.timeline.isRecording,
  isReady: state.timeline.selectedTracks.length > 0,
  time: state.timeline.time,
  length: state.settings.length,
});

const mapDispatch = dispatch => ({
  resetTime: () => dispatch(setTime(0)),
  setLengthThunk: (projectId, length) => dispatch(setLengthThunk(projectId, length)),
});

export default connect(mapState, mapDispatch)(PlaybackControls);
