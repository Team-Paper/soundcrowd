import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react'

const PlaybackControls = (props) => {
  const { togglePlay } = props;
  return (
    <Menu compact icon>
      <Menu.Item name="play" onClick={togglePlay}>
        <Icon name="play" />
      </Menu.Item>
    </Menu>
  );
};

const mapState = state => ({
  isPlaying: state.timeline.isPlaying,
});

const mapDispatch = dispatch => ({
  togglePlay() {
    console.log('toggled');
  },
});

export default connect(mapState, mapDispatch)(PlaybackControls);
