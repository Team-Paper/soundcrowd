import React from 'react';
import { Item, Header, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import context from '../DAW/context';
import { createWaveform } from '../DAW/waveformBuilder';
import { Waveform } from '../DAW/components';

const styles = {
  controls: { width: '100%' },
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
      .then(audio => this.setState({ waveform: createWaveform(audio, audio.length / 1000) }))
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
          <div style={styles.waveform}>
            <Waveform waveform={this.state.waveform} />
          </div>
          <audio controls style={styles.controls}>
            <source src={song.url} type="audio/ogg" />
          </audio>
          <Button
            as="a"
            color="facebook"
            className="fb-share-button fb-xfbml-parse-ignore"
            data-href={`https://thesoundcrowd.herokuapp.com/song/${song.id}`}
            data-layout="button"
            data-size="small"
            data-mobile-iframe="true"
            target="_blank"
            href={`https://www.facebook.com/sharer/sharer.php?u=https://thesoundcrowd.herokuapp.com/song/${song.id}`}
          >
            <Icon name="facebook" />
            Share
          </Button>
        </Item.Content>
      </Item>
    );
  }
}

export default SongView;
