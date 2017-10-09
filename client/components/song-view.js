import React from 'react';
import { Item, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


const SongView = (props) => {
  const { song, index } = props;
  let { size } = props;
  if (!size) size = 'small';

  return (
    <Item key={song.id}>
      <Item.Image size={size} src={song.imageUrl || 'http://via.placeholder.com/150x150'} />
      <Item.Content>
        <Item.Header>
          <Header>
            {!!(index + 1) && ` #${index + 1} `}
            <Link to={`/song/${song.id}`}>{song.title}</Link>
          </Header>
        </Item.Header>
        <Item.Meta>
          By: {
            song.artist.map((artist, inx) => {
              if (inx === 0) {
                return (
                  <Link key={artist.id} to={`/user/${artist.id}`}>
                    {artist.username}
                  </Link>
                );
              }
              return (
                <Link key={artist.id} to={`/user/${artist.id}`}>
                  , {artist.username}
                </Link>
              );
            })
          }
        </Item.Meta>
        <Item.Description>
          <audio controls>
            <source src={song.url} type="audio/mp3" />
          </audio>
        </Item.Description>
        <Icon name ='facebook square' class="fb-share-button" data-href={`https://thesoundcrowd/song/${song.id}`} data-layout="button" data-size="small" data-mobile-iframe="true"><a class="fb-xfbml-parse-ignore" target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https://thesoundcrowd/song/${song.id}`}>Share</a></Icon>
      </Item.Content>
    </Item>
  );
};

export default SongView;
