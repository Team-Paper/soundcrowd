import React from 'react';
import { connect } from 'react-redux';
import { Item } from 'semantic-ui-react';
import SongView from './song-view';

function SongList({ songs }) {
  return (
    <Item.Group>
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
