import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import context from '../context';
import { setIsPlaying } from '../project-store/reducers/timeline/isPlaying';
import { setStart } from '../project-store/reducers/timeline/playedAt';

const PlaybackControls = (props) => {
  const { isPlaying, togglePlay } = props;
  return (
    <Menu compact icon>
      {
        isPlaying ?
          <Menu.Item name="pause" onClick={() => togglePlay(isPlaying)}>
            <Icon name="pause" />
          </Menu.Item> :
          <Menu.Item name="play" onClick={() => togglePlay(isPlaying)}>
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
  togglePlay(isPlaying) {
    if (!isPlaying) {
      dispatch(setIsPlaying(true));
      dispatch(setStart(context.currentTime));
      // _tick();
    } else {
      dispatch(setIsPlaying(false));
      dispatch(setStart(null));
      // must cancel this_tick();
    }
  },
});

export default connect(mapState, mapDispatch)(PlaybackControls);
