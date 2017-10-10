import React from 'react';
import { Item, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import context from '../DAW/context';
import { createWaveform } from '../DAW/waveformBuilder';
import { Waveform } from '../DAW/components';

const styles = {
  waveform: {
    height: '154px',
    background: '#22a3ef',
  },
};

class SongView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      waveform: [],
    };
  }

  componentDidMount() {
    const { song } = this.props;
    axios.get(song.url, { responseType: 'arraybuffer' })
      .then(res => res.data)
      .then(responseAudio => context.decodeAudioData(responseAudio))
      .then(audio => this.setState({ waveform: createWaveform(audio) }))
      .catch(console.error);
  }

  render() {
    const { song, index } = this.props;

    return (
      <Item key={song.id}>
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
              <source src={song.url} type="audio/ogg" />
            </audio>
          </Item.Description>
          <div style={styles.waveform}>
            <Waveform waveform={this.state.waveform} />
          </div>
          <Icon name ='facebook square' className="fb-share-button" data-href={`https://thesoundcrowd/song/${song.id}`} data-layout="button" data-size="small" data-mobile-iframe="true"><a className="fb-xfbml-parse-ignore" target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https://thesoundcrowd/song/${song.id}`}>Share</a></Icon>
        </Item.Content>
      </Item>
    );
  }
}

export default SongView;
