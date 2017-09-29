import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import context from '../context';
import { setIsPlaying } from '../project-store/reducers/timeline/isPlaying';
import { setStart } from '../project-store/reducers/timeline/playedAt';

const PlaybackControls = (props) => {
  const { isPlaying, togglePlay } = props;
  console.log('props are', props);
  console.log('toggleplay is', togglePlay);
  return (
    <Menu compact icon>
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

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(PlaybackControls);
