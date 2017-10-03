import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import { setTime } from '../project-store/reducers/timeline/time';

const PlaybackControls = (props) => {
  const { isPlaying, resetTime, togglePlay } = props;
  return (
    <Menu compact icon style={{ position: 'fixed' }}>
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
    </Menu>
  );
};

const mapState = state => ({
  isPlaying: state.timeline.isPlaying,
});

const mapDispatch = dispatch => ({
  resetTime: () => dispatch(setTime(0)),
});

export default connect(mapState, mapDispatch)(PlaybackControls);
