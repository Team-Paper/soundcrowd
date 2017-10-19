import React from 'react';
import { Item } from 'semantic-ui-react';
import SongView from './song-view';

function SongList({ songs }) {
  return (
    <Item.Group divided>
      {
        songs.map(song => (
          <SongView key={song.id} song={song} />
        ))
      }
    </Item.Group>
  );
}

export default SongList;
