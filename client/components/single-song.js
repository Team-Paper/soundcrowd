import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid, Image, Header, Label, Icon, Comment } from 'semantic-ui-react';
import { fetchSong } from '../store';

class SingleSong extends React.Component {

  componentDidMount() {
    this.props.loadSong();
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.song) this.props.loadSong();
  }

  render() {
    const { song } = this.props;
    if (!song) return <div />;
    return (
      <Container>
        <Grid columns={2}>
          <Grid.Row>
            {/* This is the column for the album image, title, artists, etc as well as the actual player */}
            <Grid.Column>
              <Image src={song.trackArtUrl || 'http://via.placeholder.com/300x300'} />
              <br />
              <Header>
                {song.title}
              </Header>
              <Header>
                by {song.artists || 'unknown'}
              </Header>
              <audio controls>
                <source src={song.url} type="audio/mp3" />
              </audio>
            </Grid.Column>

            <Grid.Column>
              <Header>Notes:</Header>
              <Container text textAlign='justified'>
                {song.notes}
              </Container>
              <Label>
                {/* TODO: THIS IS HARD CODED RIGHT NOW, FIX LATER */}
                <Icon name='heart' /> {40}
              </Label>
              <Label>
                {/* TODO: THIS IS HARD CODED RIGHT NOW, FIX LATER */}
                <Icon name='play' /> {song.playcount}
              </Label>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapState = (state, ownProps) => {
  return {
    song: state.songs.find(song => Number(ownProps.match.params.id) === song.id),
  };
};

const mapDispatch = (dispatch, ownProps) => {
  const id = Number(ownProps.match.params.id);
  return {
    loadSong: () => {
      dispatch(fetchSong(id));
    },
    play: () => {
      // TODO: add thunks to the store to dispatch a play event to the api
    }
  };
};

export default connect(mapState, mapDispatch)(SingleSong);
