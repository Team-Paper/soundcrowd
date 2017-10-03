import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import context from '../context';
import { setIsPlaying } from '../project-store/reducers/timeline/isPlaying';
import { setStart } from '../project-store/reducers/timeline/playedAt';

const PlaybackControls = (props) => {
  const { isPlaying, togglePlay } = props;
  return (
    <Menu compact icon style={{ position: 'fixed' }}>
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

const mapState = (state, ownProps) => ({
  isPlaying: state.timeline.isPlaying,
});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(PlaybackControls);
