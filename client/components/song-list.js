import React from 'react';
import { connect } from 'react-redux';
import { Item } from 'semantic-ui-react';
import SongView from './song-view';
import { WaveformGradient } from '../DAW/components';

function SongList({ songs }) {
  return (
    <Item.Group>
      <WaveformGradient />
      {
        songs.map((song) => {
          return (
            <SongView key={song.id} song={song} size='tiny' />
          );
        })
      }
    </Item.Group>
  );
}

const mapState = (state, ownProps) => ({});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(SongList);
